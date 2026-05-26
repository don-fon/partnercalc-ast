import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import React from 'react'
import { ComputedWindow, OverallDamage } from 'types'
import styles from './StandardWindow.module.css'
import { NameChip, TimestampChip } from '../Chip'

interface OverallDisplayProps {
    damage: OverallDamage
    windows: ComputedWindow[]
    formatDPS: (damage: number) => string
    formatTimestamp: (time: number) => string
}

const CARD_LABELS = {
    balance: '太阳神之衡',
    spear: '战争神之枪',
}

const getWindowAnchorID = (start: number) => `card-window-${start}`

export function OverallDisplay(props: OverallDisplayProps) {
    const improvement = props.damage.optimal - props.damage.actual
    const balanceImprovement = props.damage.balance.optimal - props.damage.balance.actual
    const spearImprovement = props.damage.spear.optimal - props.damage.spear.actual
    const maxOptimal = Math.max(...props.windows.map(window => window.bestPartner.totals.total))

    const renderCardSummary = (
        name: string,
        actual: number,
        optimal: number,
        delta: number,
    ) => <div className={styles.summaryRow}>
        <Typography>{name}</Typography>
        <Typography>实际 {props.formatDPS(actual)}</Typography>
        <Typography>逐卡最优 {props.formatDPS(optimal)}</Typography>
        <Typography>差值 {props.formatDPS(delta)}</Typography>
    </div>

    const scrollToWindow = (start: number) => {
        document.getElementById(getWindowAnchorID(start))
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
    }

    const renderDecisionGroup = (cardType: ComputedWindow['cardType']) => {
        const windows = props.windows.filter(window => window.cardType === cardType)

        return <div className={styles.cardDecisionGroup}>
            <Typography variant="h5">{CARD_LABELS[cardType]}</Typography>
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
        <div className={styles.overallText}>
            <Typography variant="h3" textAlign="center">
                发卡收益汇总
            </Typography>
        </div>
        <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
                <Typography variant="h6">实际发卡</Typography>
                <Typography variant="h4">{props.formatDPS(props.damage.actual)}</Typography>
            </div>
            <div className={styles.summaryItem}>
                <Typography variant="h6">逐卡最优</Typography>
                <Typography variant="h4">{props.formatDPS(props.damage.optimal)}</Typography>
            </div>
            <div className={styles.summaryItem}>
                <Typography variant="h6">可提升</Typography>
                <Typography variant="h4">{props.formatDPS(improvement)}</Typography>
            </div>
        </div>
        <div className={styles.summaryRows}>
            {renderCardSummary(
                '太阳神之衡',
                props.damage.balance.actual,
                props.damage.balance.optimal,
                balanceImprovement,
            )}
            {renderCardSummary(
                '战争神之枪',
                props.damage.spear.actual,
                props.damage.spear.optimal,
                spearImprovement,
            )}
        </div>
        {renderDecisionGroup('balance')}
        {renderDecisionGroup('spear')}
    </div>
}
