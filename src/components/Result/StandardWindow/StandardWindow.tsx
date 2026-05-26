import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Friend } from 'api/fflogs/fight'
import React from 'react'
import { ComputedWindow } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'
import { NameChip, TimestampChip } from '../Chip'

const getWindowAnchorID = (start: number) => `card-window-${start}`

interface StandardWindowProps {
    window: ComputedWindow
    astrologian: Friend
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
}

export function StandardWindow(props: StandardWindowProps) {
    const start = props.formatTimestamp(props.window.start)
    const end = props.formatTimestamp(props.window.end)

    const target = props.window.actualPartner
    const timestampURL = props.generateTimestampLink(props.window.start, props.window.end)

    return <div id={getWindowAnchorID(props.window.start)} className={styles.standardWindow}>
        <Card className={styles.card}>
            <div className={styles.rowContainer}>
                <div className={styles.partnered}>
                    <NameChip
                        name={props.astrologian.name}
                        job={props.astrologian.job}
                        className={styles.dancer}
                    />
                    <span className={styles.partneredText}>发卡</span>
                    <NameChip name={target.name} job={target.job} />
                </div>
                <div className={styles.timestamp}>
                    <TimestampChip
                        timestamp={start + ' - ' + end}
                    />
                    <Tooltip title="打开 FFLogs 时间轴">
                        <IconButton
                            component="a"
                            href={timestampURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="medium"
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </Card>
        <Card className={styles.card + ' ' + styles.graph}>
            <DamageGraph
                players={props.window.players}
                actualPlayer={props.window.actualPartner}
            />
        </Card>
    </div>
}
