import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { ComputedPlayer } from 'types'

interface DamageTableProps {
    players: ComputedPlayer[]
    actualPlayer: ComputedPlayer
    bestPlayer: ComputedPlayer
    formatDPS: (damage: number) => string
}

export function DamageTable(props: DamageTableProps) {
    const makeRow = (player: ComputedPlayer) => {
        return <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.job.name}</TableCell>
            <TableCell>{Math.floor(player.totals.total)}</TableCell>
            <TableCell>{props.formatDPS(player.totals.total)}</TableCell>
            <TableCell>{props.formatDPS(props.bestPlayer.totals.total - player.totals.total)}</TableCell>
            <TableCell>
                {player.id === props.actualPlayer.id && '实际'}
                {player.id === props.actualPlayer.id && player.id === props.bestPlayer.id && ' / '}
                {player.id === props.bestPlayer.id && '最优'}
            </TableCell>
        </TableRow>
    }

    return <TableContainer>
        <Table aria-label="候选目标表">
            <TableHead>
                <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>职业</TableCell>
                    <TableCell>收益</TableCell>
                    <TableCell>窗口 DPS</TableCell>
                    <TableCell>距最优</TableCell>
                    <TableCell>标记</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.players.map(makeRow)}
            </TableBody>
        </Table>
    </TableContainer>
}
