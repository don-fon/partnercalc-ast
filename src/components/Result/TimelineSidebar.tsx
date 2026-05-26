import React from 'react'
import { ComputedWindow } from 'types'
import { CARD_LABELS, CardIcon } from './CardIcon'
import styles from './Result.module.css'

interface TimelineSidebarProps {
    windows: ComputedWindow[]
    formatTimestamp: (time: number) => string
}

const getWindowAnchorID = (start: number) => `card-window-${start}`

export function TimelineSidebar(props: TimelineSidebarProps) {
    const scrollToWindow = (start: number) => {
        document.getElementById(getWindowAnchorID(start))
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
    }

    return <nav className={styles.timelineSidebar} aria-label="发卡时间轴">
        <div className={styles.timelineList}>
            {props.windows.map(window => {
                const isOptimal = window.actualPartner.id === window.bestPartner.id

                return <button
                    type="button"
                    className={isOptimal ? styles.timelineItemOptimal : styles.timelineItem}
                    key={window.start}
                    onClick={() => scrollToWindow(window.start)}
                    title={`${props.formatTimestamp(window.start)} ${CARD_LABELS[window.cardType]} ${window.actualPartner.name}`}
                >
                    <span className={styles.timelineMarker} />
                    <span className={styles.timelineContent}>
                        <span className={styles.timelineTime}>
                            {props.formatTimestamp(window.start)}
                        </span>
                        <span
                            className={styles.timelineCard}
                            title={CARD_LABELS[window.cardType]}
                        >
                            <CardIcon
                                cardType={window.cardType}
                                className={styles.timelineCardIcon}
                            />
                        </span>
                        <span className={styles.timelineTarget}>
                            <span
                                className={styles.timelineJobIconFrame}
                                style={{ backgroundColor: window.actualPartner.job.color }}
                            >
                                <window.actualPartner.job.Icon
                                    height={18}
                                    width={18}
                                    fill="white"
                                    color="white"
                                    className={styles.timelineJobIcon}
                                />
                            </span>
                        </span>
                    </span>
                </button>
            })}
        </div>
    </nav>
}
