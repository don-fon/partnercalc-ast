import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { DataProvider } from 'data/provider'
import { computeCritMultiplier, computeCritRate, computeDHRate } from 'math/functions'
import {
    ComputedEvent,
    ComputedPlayer,
    ComputedWindow,
    DamageTotals,
    OverallDamage,
} from 'types'
import { CardWindow } from './cardWindow'
import { Snapshot } from '../types/snapshot'
import { EnemyHandler } from './handlers/enemies'
import { PlayerHandler } from './handlers/players'
import { SnapshotHook } from './hooks'
import { Astrologian } from './modules/entities/astrologian'

export interface StatOverrides {
    [friendID: number]: {
        crit: number
        dh: number
    }
}

export class Simulator {
    private parser: FFLogsParser
    private data: DataProvider
    private astrologian: Astrologian
    private enemies: EnemyHandler
    private players: PlayerHandler
    private statOverrides?: StatOverrides
    private cardWindows: CardWindow[] = []
    private results: ComputedWindow[] = []

    constructor(parser: FFLogsParser, astrologian: Friend, statOverrides?: StatOverrides) {
        this.parser = parser
        this.data = new DataProvider()
        this.astrologian = new Astrologian(astrologian.id, this.registerNewCardWindow, this.data)
        this.enemies = new EnemyHandler(parser.fight.friends, this.data)
        this.statOverrides = statOverrides

        const potentialTargets = parser.fight.friends.filter(player => player.id !== astrologian.id)
        this.players = new PlayerHandler(potentialTargets, this.registerNewSnapshot, this.data)
    }

    public async calculateCardDamage(): Promise<ComputedWindow[]> {
        if (this.results.length === 0) {
            await this.buildCardWindows()
        }

        return this.results
    }

    public calculateOverallDamage(): OverallDamage {
        const playerMap: Map<number, ComputedPlayer> = new Map()
        const summary = {
            actual: 0,
            optimal: 0,
            balance: {
                actual: 0,
                optimal: 0,
            },
            spear: {
                actual: 0,
                optimal: 0,
            },
        }

        for (const window of this.results) {
            const actual = window.actualPartner?.totals.total ?? 0
            const optimal = window.bestPartner?.totals.total ?? 0

            summary.actual += actual
            summary.optimal += optimal
            summary[window.cardType].actual += actual
            summary[window.cardType].optimal += optimal

            for (const player of window.players) {
                if (playerMap.has(player.id)) {
                    const totals = playerMap.get(player.id).totals

                    totals.standard += player.totals.standard
                    totals.esprit += player.totals.esprit
                    totals.devilment += player.totals.devilment
                    totals.balance += player.totals.balance
                    totals.spear += player.totals.spear
                    totals.total += player.totals.total

                } else {
                    playerMap.set(player.id, {
                        ...player,
                        damage: [],
                        totals: { ...player.totals },
                    })
                }
            }
        }

        const players = [...playerMap.values()]
        players.sort((a, b) => b.totals.total - a.totals.total)

        return {
            players: players,
            ...summary,
        }
    }

    private async buildCardWindows(): Promise<void> {
        const debuffIDs = Object.values(this.data.debuffs)
            .map(effect => effect.id)

        const events = this.parser.getEvents(debuffIDs)

        for await (const event of events) {
            this.processEvent(event)
        }

        this.results = this.cardWindows
            .map(this.calculateBuffWindow, this)
            .filter(window => window != null)
    }

    private calculateBuffWindow(window: CardWindow): ComputedWindow | undefined {
        const computedPlayers: ComputedPlayer[] = []
        const players = this.players.getPlayers()
        const actualTarget = players.find(player => player.id === window.target)

        if (actualTarget == null) {
            // Something weird happened, skip this window
            return
        }

        for (const player of players) {
            const playerStats = player.getEstimatedStats()

            if (this.statOverrides && player.id in this.statOverrides) {
                const overrides = this.statOverrides[player.id]
                if (overrides.crit > 0) {
                    playerStats.critRate = computeCritRate(overrides.crit)
                    playerStats.critMultiplier = computeCritMultiplier(overrides.crit)
                }

                if (overrides.dh > 0) {
                    playerStats.DHRate = computeDHRate(overrides.dh)
                }
            }

            const computedDamage = window.getPlayerContribution({
                stats: playerStats,
                player: player,
            })

            if (computedDamage.length === 0 && player !== actualTarget) {
                continue
            }

            const damageTotals: DamageTotals = {
                standard: 0,
                esprit: 0,
                devilment: 0,
                balance: 0,
                spear: 0,
                total: 0,
            }

            for (const damage of computedDamage) {
                damageTotals.standard += damage.standard
                damageTotals.devilment += damage.devilment
                damageTotals.esprit += damage.esprit
                damageTotals.balance += damage.balance
                damageTotals.spear += damage.spear
                damageTotals.total += damage.balance + damage.spear
            }

            computedPlayers.push({
                id: player.id,
                name: player.name,
                job: player.job,
                damage: computedDamage,
                totals: damageTotals,
            })
        }

        if (computedPlayers.length === 1 && computedPlayers[0].totals.total === 0) {
            // Empty window, skip
            return
        }

        // Sort from high DPS to low DPS
        computedPlayers.sort((a, b) => b.totals.total - a.totals.total)

        const events: ComputedEvent[] = window.getEvents().map(event => ({
            action: event.action,
            timestamp: event.timestamp,
            target: computedPlayers.find(player => player.id === event.targetID),
        }))

        return {
            start: window.start,
            end: window.end ?? this.parser.fight.end,
            cardType: window.cardType,
            players: computedPlayers,
            actualPartner: computedPlayers.find(player => player.id === window.target),
            bestPartner: computedPlayers[0],
            events: events,
        }
    }

    private processEvent(event: FFLogsEvent) {
        this.astrologian.processEvent(event)
        this.players.processEvent(event)
        this.enemies.processEvent(event)
    }

    private registerNewCardWindow = (window: CardWindow) => {
        this.cardWindows.push(window)
    }

    private registerNewSnapshot: SnapshotHook = (snapshot: Snapshot) => {
        const debuffs = this.enemies.getEnemyDebuffs(snapshot.target)
        snapshot.addDebuffs(debuffs)

        const windows = this.getWindowsForTimestamp(snapshot.timestamp)
        for (const window of windows) {
            window.processSnapshot(snapshot)
        }
    }

    private getWindowsForTimestamp(time: number): CardWindow[] {
        return this.cardWindows.filter(window => {
            if (time <= window.start) { return false }
            if (window.end != null && time > window.end) { return false }
            return true
        })
    }
}
