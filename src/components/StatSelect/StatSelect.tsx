import { Button, TextField, Typography } from '@material-ui/core'
import { Fight } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { useAsyncError } from 'components/ErrorBoundary/throwError'
import { NameChip } from 'components/Result/Chip'
import { useTitle } from 'components/Title'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const StatSelectContainer = styled.div`
    transform: translateY(15vh);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
`

const FriendContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    max-width: 600px;
`

const FriendItem = styled.div`
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
    flex-grow: 1;
    gap: 8px;
    align-items: center;
`

const FriendLabel = styled.div`
    flex-grow: 1;
`

const StatInput = styled(TextField)`
    max-width: 150px;
`

export const StatSelect = () => {
    const { reportID, fightID } = useParams()
    const { setTitle } = useTitle()
    const navigate = useNavigate()
    const [fight, setFight] = useState<Fight>()
    const [stats, setStats] = useState<{
        [key: number]: {
            crit: number,
            dh: number,
        }
    }>({})
    const asyncThrow = useAsyncError()

    setTitle('输入属性')

    const navigateToResults = () => {
        const searchParams = Object.entries(stats)
            .map(([friendID, stat]) => {
                return `${friendID}=${stat.crit ?? 0},${stat.dh ?? 0}`
            })
            .join('&')

        navigate(`/${reportID}/${fightID}?${searchParams}`)
    }

    const updateStats = (friendID: number, stat: 'crit' | 'dh') =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setStats({
                ...stats,
                [friendID]: {
                    ...stats[friendID],
                    [stat]: event.target.value,
                },
            })
        }

    const parser = useMemo(() =>
        new FFLogsParser(reportID, parseInt(fightID))
    , [fightID, reportID])

    useEffect(() => {
        const initializeParser = async () => {
            await parser.init()
            setFight(parser.fight)
        }
        initializeParser()
    }, [parser])

    if (fight == null) {
        return null
    }

    const dancer = fight.friends
        .find(friend => friend.job === JOBS.Dancer)

    if (dancer == null) {
        asyncThrow(new Error('Report does not have a Dancer.'))
    }

    const friends = fight.friends.filter(friend => friend !== dancer)

    return (
        <StatSelectContainer>
            <FriendContainer>
                {friends.map(friend => (
                    <FriendItem key={friend.id}>
                        <FriendLabel>
                            <NameChip
                                name={friend.name}
                                job={friend.job}
                            />
                        </FriendLabel>
                        <StatInput
                            id="crit"
                            variant="outlined"
                            placeholder="暴击"
                            onChange={updateStats(friend.id, 'crit')}
                        />
                        <StatInput
                            id="dh"
                            variant="outlined"
                            placeholder="直击"
                            onChange={updateStats(friend.id, 'dh')}
                        />
                    </FriendItem>
                ))}
            </FriendContainer>
            <Typography variant="h6">
                输入每个玩家的暴击/直击属性值，含食物加成。
            </Typography>
            <Typography variant="h6">
                留空以从日志中估算。
            </Typography>
            <Button onClick={navigateToResults} variant="outlined">
                计算
            </Button>
        </StatSelectContainer>
    )
}
