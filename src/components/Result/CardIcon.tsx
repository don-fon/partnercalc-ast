import React from 'react'
import { CardType } from 'types'

interface CardIconProps {
    cardType: CardType
    className?: string
}

export const CARD_LABELS = {
    balance: '太阳神之衡',
    spear: '战争神之枪',
}

const CARD_ICON_URLS = {
    balance: '/card-balance.png',
    spear: '/card-spear.png',
}

export function CardIcon(props: CardIconProps) {
    return <img
        src={CARD_ICON_URLS[props.cardType]}
        alt={CARD_LABELS[props.cardType]}
        title={CARD_LABELS[props.cardType]}
        className={props.className}
    />
}
