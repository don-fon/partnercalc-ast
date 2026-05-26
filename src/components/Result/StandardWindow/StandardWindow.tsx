import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import { ComputedWindow } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'
import { TimestampChip } from '../Chip'

const getWindowAnchorID = (start: number) => `card-window-${start}`

interface StandardWindowProps {
    window: ComputedWindow
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
}

export function StandardWindow(props: StandardWindowProps) {
    const start = props.formatTimestamp(props.window.start)
    const end = props.formatTimestamp(props.window.end)

    const timestampURL = props.generateTimestampLink(props.window.start, props.window.end)

    return <div id={getWindowAnchorID(props.window.start)} className={styles.standardWindow}>
        <Card className={styles.card + ' ' + styles.graph}>
            <div className={styles.graphToolbar}>
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
            <DamageGraph
                players={props.window.players}
                actualPlayer={props.window.actualPartner}
                cardType={props.window.cardType}
            />
        </Card>
    </div>
}
