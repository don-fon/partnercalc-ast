import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import AccessTime from '@mui/icons-material/AccessTime'
import React from 'react'
import { Job } from 'types'

interface NameChipProps extends ChipProps {
    name: string
    job: Job
    iconProps?: React.SVGProps<SVGSVGElement>
}

interface TimestampChipProps extends ChipProps {
    timestamp: number | string
}

export const NameChip = (props: NameChipProps) => {
    return <Chip
        label={props.name}
        icon={<props.job.Icon
            height={30}
            width={30}
            fill="white"
            {...props.iconProps}
        />}
        style={{
            backgroundColor: props.job.color,
            fontSize: 'large',
        }}
        {...props}
    />
}

export const TimestampChip = (props: TimestampChipProps) => {
    return <Chip
        label={props.timestamp}
        icon={<AccessTime />}
        style={{
            fontSize: 'medium',
        }}
        {...props}
    />
}
