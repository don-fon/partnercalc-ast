import CircularProgress from '@mui/material/CircularProgress'
import { FixtureFFLogsParser } from 'api/fflogs/fixtureParser'
import { useAsyncError } from 'components/ErrorBoundary/throwError'
import { useTitle } from 'components/Title'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { Simulator } from 'simulator/simulator'
import { ComputedWindow, OverallDamage } from 'types'
import { withPublicPath } from 'util/publicPath'
import { generateFFLogsTimelineLink } from './fflogsLinks'
import styles from './Result.module.css'
import { OverallDisplay } from './StandardWindow/OverallDisplay'
import { StandardWindow } from './StandardWindow/StandardWindow'
import { TimelineSidebar } from './TimelineSidebar'

const FIXTURE_URL = withPublicPath('fixtures/fflogs-test-fixture.json')

export function TestResult() {
    const { setTitle } = useTitle()
    const [ready, setReady] = useState<boolean>(false)
    const [windows, setWindows] = useState<ComputedWindow[]>([])
    const [overall, setOverall] = useState<OverallDamage>()
    const asyncThrow = useAsyncError()

    const parser = useMemo(() => new FixtureFFLogsParser(FIXTURE_URL), [])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()

            const astrologian = parser.fight.friends
                .find(friend => friend.job === JOBS.Astrologian)

            if (astrologian == null) {
                asyncThrow(new Error('测试数据中没有占星。'))
                return
            }

            const simulator = new Simulator(parser, astrologian)
            const windows = await simulator.calculateCardDamage()

            if (windows.length <= 0) {
                asyncThrow(new Error('测试数据中没有发卡窗口。'))
                return
            }

            setTitle(`测试数据 - ${parser.fight.encounter} - ${astrologian.name}`)
            setWindows(windows)
            setOverall(simulator.calculateOverallDamage())
            setReady(true)
        }
        simulate().catch(error => asyncThrow(error))
    }, [asyncThrow, parser, setTitle])

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

    const astrologian = parser.fight.friends
        .find(friend => friend.job === JOBS.Astrologian)

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
