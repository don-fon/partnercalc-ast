import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import React from 'react'
import { ComputedWindow, OverallDamage } from 'types'
import { CARD_LABELS, CardIcon } from '../CardIcon'
import styles from './StandardWindow.module.css'
import { NameChip, TimestampChip } from '../Chip'

interface OverallDisplayProps {
    damage: OverallDamage
    windows: ComputedWindow[]
    formatDPS: (damage: number) => string
    formatTimestamp: (time: number) => string
}

const getWindowAnchorID = (start: number) => `card-window-${start}`

export function OverallDisplay(props: OverallDisplayProps) {
    const maxOptimal = Math.max(...props.windows.map(window => window.bestPartner.totals.total))

    const renderCardSummary = (actual: number, optimal: number, delta: number) => {
        const items = [
            ['实际', actual],
            ['逐卡最优', optimal],
            ['差值', delta],
        ]

        return <div className={styles.summaryRow}>
            {items.map(([label, value]) => (
                <div className={styles.summaryMetric} key={label}>
                    <Typography className={styles.summaryMetricLabel}>
                        {label}
                    </Typography>
                    <Typography className={styles.summaryMetricValue}>
                        {props.formatDPS(value as number)}
                    </Typography>
                </div>
            ))}
        </div>
    }

    const scrollToWindow = (start: number) => {
        document.getElementById(getWindowAnchorID(start))
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
    }

    const renderDecisionGroup = (cardType: ComputedWindow['cardType']) => {
        const windows = props.windows.filter(window => window.cardType === cardType)
        const damage = props.damage[cardType]
        const improvement = damage.optimal - damage.actual

        return <div className={styles.cardDecisionGroup}>
            <div className={styles.cardDecisionHeader}>
                <div className={styles.cardDecisionTitle}>
                    <CardIcon cardType={cardType} className={styles.cardTitleIcon} />
                    <Typography variant="h5">{CARD_LABELS[cardType]}</Typography>
                </div>
                {renderCardSummary(
                    damage.actual,
                    damage.optimal,
                    improvement,
                )}
            </div>
            <div className={styles.cardDecisionList}>
                {windows.map(window => {
                    const actual = window.actualPartner
                    const best = window.bestPartner
                    const isOptimal = actual.id === best.id
                    const loss = best.totals.total - actual.totals.total
                    const actualWidth = Math.max((actual.totals.total / maxOptimal) * 100, 1)
                    const optimalWidth = Math.max((best.totals.total / maxOptimal) * 100, 1)

                    return <Card
                        className={styles.cardDecision}
                        key={window.start}
                        role="button"
                        tabIndex={0}
                        onClick={() => scrollToWindow(window.start)}
                        onKeyDown={event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                scrollToWindow(window.start)
                            }
                        }}
                    >
                        <div className={styles.cardDecisionMeta}>
                            <TimestampChip timestamp={props.formatTimestamp(window.start)} />
                        </div>
                        <div className={styles.cardDecisionChart}>
                            <div className={styles.cardDecisionBarTrack}>
                                <div
                                    className={styles.cardDecisionOptimalBar}
                                    style={{ width: `${optimalWidth}%` }}
                                />
                                <div
                                    className={isOptimal
                                        ? styles.cardDecisionActualBarOptimal
                                        : styles.cardDecisionActualBar}
                                    style={{ width: `${actualWidth}%` }}
                                />
                            </div>
                        </div>
                        <div className={styles.cardDecisionTarget}>
                            <Typography>实际 {props.formatDPS(actual.totals.total)}</Typography>
                            <NameChip name={actual.name} job={actual.job} />
                        </div>
                        <div className={styles.cardDecisionTarget}>
                            <Typography>最优 {props.formatDPS(best.totals.total)}</Typography>
                            <NameChip name={best.name} job={best.job} />
                        </div>
                        <div className={isOptimal ? styles.cardDecisionGood : styles.cardDecisionBad}>
                            <Typography>
                                {isOptimal ? '命中最优' : `损失 ${props.formatDPS(loss)}`}
                            </Typography>
                        </div>
                    </Card>
                })}
            </div>
        </div>
    }

    return <div className={styles.overallWindow}>
        {renderDecisionGroup('balance')}
        {renderDecisionGroup('spear')}
    </div>
}
