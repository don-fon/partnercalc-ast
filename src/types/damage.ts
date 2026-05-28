import { Action } from './action'
import { Job } from './job'
import { Stats } from './stats'

export type CardType = 'balance' | 'spear'

interface DamageTypes {
    standard: number
    esprit: number
    devilment: number
    balance: number
    spear: number
}

export interface ComputedDamage extends DamageTypes {
    timestamp: number
}

export interface DamageTotals extends DamageTypes {
    total: number
}

export interface HitStats {
    directHits: number
    crits: number
    hits: number
}

export interface ComputedPlayer {
    id: number
    name: string
    job: Job
    stats: Stats
    hitStats: HitStats
    damage: ComputedDamage[]
    totals: DamageTotals
}

export interface ComputedEvent {
    action: Action
    timestamp: number
    target?: ComputedPlayer
}

export interface ComputedDPSPoint {
    timestamp: number
    dps: number
}

export interface ComputedWindow {
    start: number
    end: number
    cardType: CardType
    players: ComputedPlayer[]
    actualPartner: ComputedPlayer
    bestPartner: ComputedPlayer
    events: ComputedEvent[]
    targetDps: ComputedDPSPoint[]
}

export interface OverallCardSummary {
    actual: number
    optimal: number
}

export interface OverallDamage {
    players: ComputedPlayer[]
    actual: number
    optimal: number
    balance: OverallCardSummary
    spear: OverallCardSummary
}
