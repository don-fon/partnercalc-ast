import { ApplyBuffEvent, FFLogsEvent, RemoveBuffEvent } from 'api/fflogs/event'
import { DataProvider } from 'data/provider'
import { CardWindow } from 'simulator/cardWindow'
import { CardType } from 'types'
import { Entity } from './entity'

type CardWindowHook = (window: CardWindow) => void

export class Astrologian extends Entity {
    public id: number
    private emitWindow: CardWindowHook
    private windowsByTargetAndCard: Map<string, CardWindow> = new Map()

    constructor(id: number, cardWindowHook: CardWindowHook, data: DataProvider) {
        super(id.toString(), data)
        this.id = id
        this.emitWindow = cardWindowHook
        this.init()
    }

    protected init() {
        this.addHook('applybuff', this.onBalance, { actionID: this.data.statuses.THE_BALANCE.id })
        this.addHook('removebuff', this.onRemoveBalance, { actionID: this.data.statuses.THE_BALANCE.id })
        this.addHook('applybuff', this.onSpear, { actionID: this.data.statuses.THE_SPEAR.id })
        this.addHook('removebuff', this.onRemoveSpear, { actionID: this.data.statuses.THE_SPEAR.id })
    }

    public processEvent(event: FFLogsEvent) {
        if (event.sourceID !== this.id) {
            return
        }

        super.processEvent(event)
    }

    private onBalance(event: ApplyBuffEvent) {
        this.openCardWindow(event, 'balance')
    }

    private onRemoveBalance(event: RemoveBuffEvent) {
        this.closeCardWindow(event.targetID, 'balance', event.timestamp)
    }

    private onSpear(event: ApplyBuffEvent) {
        this.openCardWindow(event, 'spear')
    }

    private onRemoveSpear(event: RemoveBuffEvent) {
        this.closeCardWindow(event.targetID, 'spear', event.timestamp)
    }

    private openCardWindow(event: ApplyBuffEvent, cardType: CardType) {
        this.closeCardWindow(event.targetID, cardType, event.timestamp)

        const window = new CardWindow(event.timestamp, event.targetID, cardType, this.data)
        this.windowsByTargetAndCard.set(this.keyFor(event.targetID, cardType), window)
        this.emitWindow(window)
    }

    private closeCardWindow(targetID: number, cardType: CardType, timestamp: number) {
        const key = this.keyFor(targetID, cardType)
        const window = this.windowsByTargetAndCard.get(key)

        if (window) {
            window.close(timestamp)
            this.windowsByTargetAndCard.delete(key)
        }
    }

    private keyFor(targetID: number, cardType: CardType) {
        return `${targetID}:${cardType}`
    }
}
