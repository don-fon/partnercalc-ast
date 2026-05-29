import React, { useEffect, useMemo, useState } from 'react'
import { CardType } from 'types'
import type { ComputedTargetDamageEvent } from 'types/damage'
import { formatDamage } from 'util/format'
import styles from './TargetDamagePlot.module.css'

interface TargetDamagePlotProps {
    events: ComputedTargetDamageEvent[]
    cardType: CardType
    start: number
    end: number
    formatTimestamp: (time: number) => string
}

interface IconInfo {
    name: string
    iconUrl?: string
    shortLabel?: string
}

const iconCache: Map<string, IconInfo> = new Map()
const X_AXIS_TICK_COUNT = 5

const CARD_COLORS = {
    balance: '#ffcc66',
    spear: '#b18cff',
}

export function TargetDamagePlot(props: TargetDamagePlotProps) {
    const [icons, setIcons] = useState<Map<string, IconInfo>>(iconCache)
    const firstTimestamp = props.events[0]?.timestamp ?? props.start
    const lastTimestamp = props.events[props.events.length - 1]?.timestamp ?? props.end
    const xMin = Math.min(firstTimestamp, props.start)
    const xMax = Math.max(lastTimestamp, props.end)
    const maxDamage = Math.max(...props.events.map(event => event.amount), 1)

    const ticks = useMemo(() => {
        return Array.from({ length: X_AXIS_TICK_COUNT }, (_, index) => {
            const ratio = X_AXIS_TICK_COUNT === 1 ? 0 : index / (X_AXIS_TICK_COUNT - 1)
            return xMin + ((xMax - xMin) * ratio)
        })
    }, [xMax, xMin])

    useEffect(() => {
        const keys = props.events
            .map(getIconKey)
            .filter((key): key is string => key != null && !iconCache.has(key))

        if (keys.length === 0) {
            return
        }

        let cancelled = false

        Promise.all(keys.map(loadIconInfo)).then(() => {
            if (!cancelled) {
                setIcons(new Map(iconCache))
            }
        })

        return () => {
            cancelled = true
        }
    }, [props.events])

    return <div className={styles.plot}>
        <div className={styles.yAxis}>
            <span>{formatDamage(maxDamage)}</span>
            <span>0</span>
        </div>
        <div className={styles.grid}>
            <div
                className={styles.cardWindow}
                style={{
                    left: `${toPercent(props.start, xMin, xMax)}%`,
                    width: `${toPercent(props.end, xMin, xMax) - toPercent(props.start, xMin, xMax)}%`,
                    backgroundColor: CARD_COLORS[props.cardType],
                }}
            />
            {ticks.map(tick => (
                <div
                    className={styles.xTick}
                    key={tick}
                    style={{ left: `${toPercent(tick, xMin, xMax)}%` }}
                >
                    <span>{props.formatTimestamp(tick)}</span>
                </div>
            ))}
            {props.events.map((event, index) => {
                const key = getIconKey(event)
                const icon = key == null ? undefined : icons.get(key)
                const left = toPercent(event.timestamp, xMin, xMax)
                const bottom = 6 + (event.amount / maxDamage) * 82

                return <div
                    className={styles.damagePoint}
                    key={`${event.timestamp}-${event.actionID ?? event.statusID}-${index}`}
                    style={{ left: `${left}%`, bottom: `${bottom}%` }}
                    title={`${formatPreciseTimestamp(event.timestamp, props.start)} ${icon?.name ?? '伤害'} ${formatDamage(event.amount)}`}
                >
                    <div className={styles.iconFrame}>
                        {icon?.iconUrl != null
                            ? <img
                                src={icon.iconUrl}
                                alt=""
                                onError={event => {
                                    event.currentTarget.style.display = 'none'
                                }}
                            />
                            : <span>{icon?.shortLabel ?? (event.statusID != null ? 'DoT' : event.actionID ?? '?')}</span>}
                    </div>
                    <span className={styles.amount}>
                        {formatDamage(event.amount)}
                    </span>
                </div>
            })}
        </div>
    </div>
}

const getIconKey = (event: ComputedTargetDamageEvent) => {
    if (event.actionID === 7) {
        return 'AutoAttack:7'
    }

    if (event.actionID != null) {
        return `Action:${event.actionID}`
    }

    if (event.statusID != null) {
        return `Status:${event.statusID}`
    }
}

const loadIconInfo = async (key: string) => {
    const [sheet, id] = key.split(':')

    if (key === 'AutoAttack:7') {
        iconCache.set(key, {
            name: '攻击',
            iconUrl: 'https://assets.rpglogs.cn/img/ff/abilities/000000-000101.png',
        })
        return
    }

    const response = await fetch(`https://xivapi-v2.xivcdn.com/api/sheet/${sheet}/${id}?fields=Name,Icon&language=chs`)

    if (!response.ok) {
        iconCache.set(key, { name: key })
        return
    }

    const data = await response.json()
    const iconPath = data.fields?.Icon?.path_hr1 ?? data.fields?.Icon?.path
    const name = data.fields?.Name ?? key

    iconCache.set(key, {
        name: name,
        iconUrl: iconPath == null ? undefined : makeAssetURL(iconPath),
    })
}

const makeAssetURL = (path: string) => {
    const match = path.match(/^ui\/icon\/(\d{6})\/(\d{6}(?:_hr1)?)\.tex$/)

    if (match == null) {
        return undefined
    }

    return `https://xivapi.com/i/${match[1]}/${match[2]}.png`
}


const toPercent = (value: number, min: number, max: number) => {
    if (max <= min) {
        return 0
    }

    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)
}

const formatPreciseTimestamp = (timestamp: number, windowStart: number) => {
    const elapsed = Math.max(timestamp - windowStart, 0) / 1000
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed - (minutes * 60)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toFixed(2).padStart(5, '0')}`
}
