import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { ComputedWindow } from 'types'
import type { DamageCalculationMode } from 'types/damage'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'
import { TargetDamagePlot } from './TargetDamagePlot'
import { TimestampChip } from '../Chip'
import { getWindowAnchorID } from '../scrollToWindow'

interface StandardWindowProps {
    window: ComputedWindow
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
    damageCalculationMode: DamageCalculationMode
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
                damageCalculationMode={props.damageCalculationMode}
            />
            <Accordion className={styles.dpsAccordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        发卡目标伤害点阵
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TargetDamagePlot
                        events={props.window.targetDamageEvents}
                        cardType={props.window.cardType}
                        start={props.window.start}
                        end={props.window.end}
                        formatTimestamp={props.formatTimestamp}
                    />
                </AccordionDetails>
            </Accordion>
        </Card>
    </div>
}
