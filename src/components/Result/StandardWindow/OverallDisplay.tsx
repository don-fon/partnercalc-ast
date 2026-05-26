import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'
import { OverallDamage } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import { DamageTable } from './DamageTable/DamageTable'
import styles from './StandardWindow.module.css'
import { NameChip } from '../Chip'

interface OverallDisplayProps {
    damage: OverallDamage
    formatDPS: (damage: number) => string
}

export function OverallDisplay(props: OverallDisplayProps) {
    const best = props.damage.bestPartner

    return <div className={styles.overallWindow}>
        <div className={styles.overallText}>
            <Typography variant="h3" textAlign="center">
                整体最佳舞伴：
            </Typography>
            <NameChip
                name={best.name}
                job={best.job}
                iconProps={{
                    height: 50,
                    width: 50,
                }}
                className={styles.overallChip}
                style={{ backgroundColor: best.job.color }}
            />
        </div>
        <div className={styles.overallText}>
            <Typography variant="h5" textAlign="center">
                预期 DPS：{props.formatDPS(best.totals.total)}
            </Typography>
        </div>
        <Card className={styles.card + ' ' + styles.graph}>
            <DamageGraph players={props.damage.players} />
        </Card>
        <div>
            <Accordion
                TransitionProps={{ unmountOnExit: true }}
                className={styles.accordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    伤害表
                </AccordionSummary>
                <AccordionDetails className={styles.accordionContent}>
                    <DamageTable players={props.damage.players} formatDPS={props.formatDPS} />
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
}
