import CircularProgress from '@mui/material/CircularProgress'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { useAsyncError } from 'components/ErrorBoundary/throwError'
import { useTitle } from 'components/Title'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Simulator } from 'simulator/simulator'
import { ComputedWindow, OverallDamage } from 'types'
import { generateFFLogsTimelineLink } from './fflogsLinks'
import styles from './Result.module.css'
import { OverallDisplay } from './StandardWindow/OverallDisplay'
import { StandardWindow } from './StandardWindow/StandardWindow'
import { TimelineSidebar } from './TimelineSidebar'

export function Result() {
    const { reportID, fightID } = useParams()
    const [searchParams] = useSearchParams()
    const { setTitle } = useTitle()
    const [ready, setReady] = useState<boolean>(false)
    const [windows, setWindows] = useState<ComputedWindow[]>([])
    const [overall, setOverall] = useState<OverallDamage>()
    const [astrologian, setAstrologian] = useState<Friend>()
    const asyncThrow = useAsyncError()

    const parser = useMemo(() => {
        return new FFLogsParser(reportID, parseInt(fightID))
    }, [fightID, reportID])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()

            const astrologian = parser.fight.friends
                .find(friend => friend.job === JOBS.Astrologian)

            if (astrologian == null) {
                asyncThrow(new Error('该报告中没有占星。'))
                return
            }

            setAstrologian(astrologian)

            const statOverrides: { [friendID: number]: { crit: number, dh: number } } = {}

            for (const [friendID, value] of searchParams) {
                const [crit, dh] = value.split(',').map(parseFloat)
                statOverrides[parseInt(friendID)] = { crit, dh }
            }

            const simulator = new Simulator(parser, astrologian, statOverrides)
            const windows = await simulator.calculateCardDamage()

            if (windows.length <= 0) {
                asyncThrow(new Error('占星发过卡吗？'))
            }

            setWindows(windows)
            setOverall(simulator.calculateOverallDamage())
            setReady(true)
        }
        simulate().catch(console.error)
    }, [asyncThrow, parser, searchParams, setReady, setWindows])

    useEffect(() => {
        if (parser != null && astrologian != null) {
            setTitle(`${parser.fight.encounter} - ${astrologian.name}`)
        }
    }, [astrologian, parser, setTitle])

    const generateTimestampLink = (start: number, end: number) => {
        return generateFFLogsTimelineLink(
            parser.reportID,
            parser.fightID,
            parser.fight.start,
            parser.fight.end,
            start,
            end,
        )
    }

    if (!ready) {
        return <CircularProgress size={80} className={styles.loading} />
    }

    return <div>
        <div className={styles.fadeTop} />
        <div className={styles.resultLayout}>
            <div className={styles.result}>
                <OverallDisplay
                    damage={overall}
                    windows={windows}
                    formatTimestamp={parser.formatTimestamp}
                />
                {windows.map(window =>
                    <StandardWindow
                        window={window}
                        formatTimestamp={parser.formatTimestamp}
                        generateTimestampLink={generateTimestampLink}
                        key={window.start}
                    />
                )}
                <div className={styles.fadeBottom} />
            </div>
            <TimelineSidebar
                windows={windows}
                formatTimestamp={parser.formatTimestamp}
            />
        </div>
    </div>
}
