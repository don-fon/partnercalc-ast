import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import React from 'react'
import { ComputedPlayer } from 'types'

interface DamageTableProps {
    players: ComputedPlayer[]
    formatDPS: (damage: number) => string
}

export function DamageTable(props: DamageTableProps) {
    const makeRow = (player: ComputedPlayer) => {
        return <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.job.name}</TableCell>
            <TableCell>{Math.floor(player.totals.standard)}</TableCell>
            <TableCell>{Math.floor(player.totals.devilment)}</TableCell>
            <TableCell>{Math.floor(player.totals.esprit)}</TableCell>
            <TableCell>{Math.floor(player.totals.total)}</TableCell>
            <TableCell>{props.formatDPS(player.totals.total)}</TableCell>
        </TableRow>
    }

    return <TableContainer>
        <Table aria-label="伤害表">
            <TableHead>
                <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>职业</TableCell>
                    <TableCell>标准舞步</TableCell>
                    <TableCell>进攻之探戈</TableCell>
                    <TableCell>伶俐</TableCell>
                    <TableCell>总计</TableCell>
                    <TableCell>DPS</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.players.map(makeRow)}
            </TableBody>
        </Table>
    </TableContainer>
}
