import { DataProvider } from 'data/provider'
import { simulatePotencyBuff } from 'math/rdps'
import { SnapshotHandler } from 'simulator/handlers/snapshots'
import { Player } from 'simulator/modules/entities/player'
import { Action, CardType, ComputedDamage, Effect, Job, Snapshot, Stats } from 'types'

export interface CardWindowInfo {
    stats: Stats
    player: Player
}

export interface CardWindowEvent {
    action: Action
    timestamp: number
    targetID: number
}

const CARD_ACTIONS: Record<CardType, Action> = {
    balance: {
        name: '太阳神之衡',
        id: 3887,
    },
    spear: {
        name: '战争神之枪',
        id: 3889,
    },
}

const CORRECT_CARD_POTENCY = 1.06
const WRONG_CARD_POTENCY = 1.03

const BALANCE_JOBS = new Set([
    'Dark Knight',
    'Gunbreaker',
    'Paladin',
    'Warrior',
    'Dragoon',
    'Monk',
    'Ninja',
    'Reaper',
    'Samurai',
    'Viper',
])

export class CardWindow {
    public readonly start: number
    public readonly target: number
    public readonly cardType: CardType
    public end?: number

    private readonly effect: Effect
    private readonly snapshots: SnapshotHandler = new SnapshotHandler()
    private readonly events: CardWindowEvent[] = []

    constructor(start: number, target: number, cardType: CardType, data: DataProvider) {
        this.start = start
        this.target = target
        this.cardType = cardType
        this.effect = cardType === 'balance'
            ? data.effects.THE_BALANCE
            : data.effects.THE_SPEAR
        this.events.push({
            action: CARD_ACTIONS[cardType],
            timestamp: start,
            targetID: target,
        })
    }

    public getPlayerContribution(windowInfo: CardWindowInfo): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(windowInfo.player.id)

        if (!snapshots) { return [] }

        const effect = this.getEffectForJob(windowInfo.player.job)

        return snapshots.map(snapshot => {
            const contribution = simulatePotencyBuff(snapshot, windowInfo.stats, effect)

            return {
                timestamp: snapshot.timestamp,
                standard: 0,
                esprit: 0,
                devilment: 0,
                balance: this.cardType === 'balance' ? contribution : 0,
                spear: this.cardType === 'spear' ? contribution : 0,
            }
        })
    }

    public processSnapshot(snapshot: Snapshot) {
        if (this.end == null) {
            this.snapshots.handleSnapshot(snapshot)
        }
    }

    public close(timestamp: number) {
        this.end = timestamp
    }

    public getEvents(): readonly CardWindowEvent[] {
        return this.events
    }

    private getEffectForJob(job: Job): Effect {
        const isBalanceTarget = BALANCE_JOBS.has(job.name)
        const isCorrectTarget = this.cardType === 'balance'
            ? isBalanceTarget
            : !isBalanceTarget

        return {
            ...this.effect,
            potency: isCorrectTarget ? CORRECT_CARD_POTENCY : WRONG_CARD_POTENCY,
        }
    }
}
