import React from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceArea,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { CardType, ComputedDPSPoint } from 'types'
import { formatDamage } from 'util/format'

interface TargetDpsChartProps {
    points: ComputedDPSPoint[]
    cardType: CardType
    start: number
    end: number
    formatTimestamp: (time: number) => string
}

const CARD_LINE_COLORS = {
    balance: '#ffcc66',
    spear: '#b18cff',
}

export function TargetDpsChart(props: TargetDpsChartProps) {
    const data = props.points.map(point => ({
        timestamp: point.timestamp,
        dps: Math.floor(point.dps),
    }))
    const firstTimestamp = data[0]?.timestamp ?? props.start
    const lastTimestamp = data[data.length - 1]?.timestamp ?? props.end
    const xMin = Math.min(firstTimestamp, props.start)
    const xMax = Math.max(lastTimestamp, props.end)

    return <ResponsiveContainer width="100%" height={260}>
        <LineChart
            data={data}
            margin={{
                top: 16,
                right: 28,
                bottom: 8,
                left: 8,
            }}
        >
            <CartesianGrid opacity={0.35} vertical={false} />
            <XAxis
                dataKey="timestamp"
                type="number"
                domain={[xMin, xMax]}
                tickFormatter={props.formatTimestamp}
                stroke="white"
                tickLine={false}
            />
            <YAxis
                stroke="white"
                tickLine={false}
                tickFormatter={formatDamage}
            />
            <Tooltip
                labelFormatter={props.formatTimestamp}
                formatter={(value: number) => [formatDamage(value), 'DPS']}
                wrapperStyle={{ outline: 'none' }}
            />
            <ReferenceArea
                x1={props.start}
                x2={props.end}
                fill={CARD_LINE_COLORS[props.cardType]}
                fillOpacity={0.12}
            />
            <Line
                type="monotone"
                dataKey="dps"
                stroke={CARD_LINE_COLORS[props.cardType]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
            />
        </LineChart>
    </ResponsiveContainer>
}
