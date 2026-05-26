import React from 'react'
import {
    Bar,
    BarChart,
    Cell,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { CardType, ComputedPlayer } from 'types'
import { formatDamage } from 'util/format'
import styles from './DamageGraph.module.css'
import { GraphTooltip } from './Tooltip'

interface DamageGraphProps {
    players: ComputedPlayer[]
    actualPlayer: ComputedPlayer
    cardType: CardType
}

export function DamageGraph(props: DamageGraphProps) {
    const card = CARD_GRAPH_CONFIG[props.cardType]
    const data = props.players.map(player => ({
        name: player.name,
        [card.label]: Math.floor(player.totals[props.cardType]),
    }))

    return <div className={styles.standardGraph}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: 0,
                }}
                layout="vertical"
            >
                <XAxis
                    type="number"
                    stroke="white"
                    tickCount={8}
                    tickLine={false}
                    tickFormatter={formatDamage}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="white"
                    tick={playerNameTick(props.players)}
                    tickLine={false}
                />
                <Tooltip
                    cursor={{ fillOpacity: 0.1 }}
                    wrapperStyle={{ outline: 'none' }}
                    content={<GraphTooltip />}
                />
                <CartesianGrid horizontal={false} vertical={true} opacity={0.5} />
                <Bar dataKey={card.label} barSize={30} fill={card.color}>
                    {props.players.map(player =>
                        <Cell
                            key={player.id}
                            fill={player.id === props.actualPlayer.id ? card.actualColor : card.color}
                        />
                    )}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
}

const CARD_GRAPH_CONFIG = {
    balance: {
        label: '太阳神之衡',
        color: '#f0a33a',
        actualColor: '#ffcc66',
    },
    spear: {
        label: '战争神之枪',
        color: '#7897ff',
        actualColor: '#b18cff',
    },
}

interface AxisTickProps {
    x: number
    y: number
    payload: {
        coordinate: number
        value: string
        index: number
        offset: number
        tickCoord: number
    }
}

const playerNameTick = (players: ComputedPlayer[]) => (props: AxisTickProps) => {
    const { x, y, payload } = props

    const player = players.find(player => player.name === payload.value)

    if (player == null) { return }

    const label = formatPlayerAxisLabel(player.name)

    return <g transform={`translate(${x},${y})`} fill="white">
        <text
            x={-32}
            y={8}
            textAnchor="end"
        >
            {label}
        </text>
        <player.job.Icon
            height={30}
            width={30}
            x={-28}
            y={-13}
        />
    </g>
}

const formatPlayerAxisLabel = (name: string) => {
    const anonymousName = name.match(/^Player \((\d+)\)$/)
    if (anonymousName != null) {
        return `#${anonymousName[1]}`
    }

    return name
        .split(' ')
        .map(name => name.charAt(0).toUpperCase() + '.')
        .join(' ')
}
