import { DataProvider } from 'data/provider'
import { simulatePotencyBuff } from 'math/rdps'
import { SnapshotHandler } from 'simulator/handlers/snapshots'
import { Player } from 'simulator/modules/entities/player'
import { Action, CardType, ComputedDamage, Effect, Job, Snapshot, Stats } from 'types'
import { DamageEvent, TickEvent } from 'api/fflogs/event'

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
export const CARD_CONTEXT_MS = 10000

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
    private readonly fightStart: number
    private readonly fightEnd: number
    public end?: number

    private readonly effect: Effect
    private readonly snapshots: SnapshotHandler = new SnapshotHandler()
    private readonly contextDamageEvents: Array<DamageEvent | TickEvent> = []
    private readonly events: CardWindowEvent[] = []

    constructor(
        start: number,
        target: number,
        cardType: CardType,
        data: DataProvider,
        fightStart: number,
        fightEnd: number,
    ) {
        this.start = start
        this.target = target
        this.cardType = cardType
        this.fightStart = fightStart
        this.fightEnd = fightEnd
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

    public processContextDamageEvent(event: DamageEvent | TickEvent) {
        if (event.sourceID !== this.target) { return }
        if (event.timestamp < this.start - CARD_CONTEXT_MS) { return }
        if (this.end != null && event.timestamp > this.end + CARD_CONTEXT_MS) { return }

        this.contextDamageEvents.push(event)
    }

    public close(timestamp: number) {
        this.end = timestamp
    }

    public getEvents(): readonly CardWindowEvent[] {
        return this.events
    }

    public getTargetDpsPoints(fallbackEnd: number): { timestamp: number, dps: number }[] {
        const start = Math.max(this.start - CARD_CONTEXT_MS, this.fightStart)
        const end = Math.min((this.end ?? fallbackEnd) + CARD_CONTEXT_MS, this.fightEnd)
        const buckets: Map<number, number> = new Map()

        for (const event of this.contextDamageEvents) {
            if (event.timestamp < start || event.timestamp > end) {
                continue
            }

            const bucket = start + Math.floor((event.timestamp - start) / 1000) * 1000
            buckets.set(bucket, (buckets.get(bucket) ?? 0) + event.amount)
        }

        const points: { timestamp: number, dps: number }[] = []

        for (let timestamp = start; timestamp <= end; timestamp += 1000) {
            points.push({
                timestamp: timestamp,
                dps: buckets.get(timestamp) ?? 0,
            })
        }

        return points
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
