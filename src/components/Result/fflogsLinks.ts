const TIMELINE_CONTEXT_MS = 10000

export function generateFFLogsTimelineLink(
    reportID: string,
    fightID: number,
    fightStart: number,
    fightEnd: number,
    startTimestamp: number,
    endTimestamp: number,
) {
    const fightURL = `https://cn.fflogs.com/reports/${reportID}#fight=${fightID}`
    const start = Math.max(startTimestamp - TIMELINE_CONTEXT_MS, fightStart)
    const end = Math.min(endTimestamp + TIMELINE_CONTEXT_MS, fightEnd)

    return fightURL + `&type=casts&view=timeline&start=${start}&end=${end}`
}
