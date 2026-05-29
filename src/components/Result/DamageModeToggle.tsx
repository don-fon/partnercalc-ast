import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import type { DamageCalculationMode } from 'types/damage'
import styles from './Result.module.css'

interface DamageModeToggleProps {
    damageCalculationMode: DamageCalculationMode
    setDamageCalculationMode: (mode: DamageCalculationMode) => void
}

export function DamageModeToggle(props: DamageModeToggleProps) {
    return <div className={styles.modeControl}>
        <span className={styles.modeControlLabel}>暴直口径</span>
        <ToggleButtonGroup
            exclusive
            size="small"
            value={props.damageCalculationMode}
            onChange={(_, value: DamageCalculationMode | null) => {
                if (value != null) {
                    props.setDamageCalculationMode(value)
                }
            }}
        >
            <Tooltip
                title="把本次暴击/直击运气抹平，按角色平时的暴击率和直击率估算这张卡通常能赚多少。适合判断发卡选择是否合理。"
                arrow
            >
                <ToggleButton value="expected">期望暴直</ToggleButton>
            </Tooltip>
            <Tooltip
                title="保留这次战斗真实发生的暴击/直击结果。某次技能暴直了，收益就会跟着更高；没暴直则更低。适合复盘单次战斗。"
                arrow
            >
                <ToggleButton value="actual">实际暴直</ToggleButton>
            </Tooltip>
        </ToggleButtonGroup>
    </div>
}
