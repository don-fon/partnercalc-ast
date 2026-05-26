import Typography from '@mui/material/Typography'
import React from 'react'
import { TooltipProps } from 'recharts'
import { CardType } from 'types'
import { formatDamage } from 'util/format'
import { CardIcon } from '../../CardIcon'
import styles from './Tooltip.module.css'

export const GraphTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<number, string>): JSX.Element => {
    if (active && payload && payload.length > 0) {
        const items = payload.filter(item => item.value != null && item.value > 0)

        const getCardType = (label: string): CardType => {
            if (label === '太阳神之衡') {
                return 'balance'
            }

            return 'spear'
        }

        return <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h6" className={styles.header}>
                    {label}
                </Typography>
            </div>
            {items.map(item =>
                <div className={styles.content} key={item.dataKey}>
                    <CardIcon
                        cardType={getCardType(item.name)}
                        className={styles.cardIcon}
                    />
                    <div className={styles.label}>
                        <Typography>{item.name}</Typography>
                    </div>
                    <div className={styles.value}>
                        <Typography>{formatDamage(item.value)}</Typography>
                    </div>
                </div>
            )}
        </div>
    }

    return null
}
