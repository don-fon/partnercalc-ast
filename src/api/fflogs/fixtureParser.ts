import { JOBS } from 'data/jobs'
import { formatTimestamp } from 'util/format'
import { FFLogsEvent } from './event'
import { Fight, Friend, Pet } from './fight'

interface FixtureFriend {
    id: number
    name: string
    jobKey: keyof typeof JOBS
}

interface FixturePet {
    id: number
    name: string
    ownerID: number
}

interface FixtureFight {
    reportID: string
    fightID: number
    zoneID: number
    encounter: string
    start: number
    end: number
    friends: FixtureFriend[]
    pets: FixturePet[]
}

interface FixtureData {
    fight: FixtureFight
    events: FFLogsEvent[]
}

export class FixtureFFLogsParser {
    public reportID: string
    public fightID: number
    public fight: Fight
    private fixtureURL: string
    private events: FFLogsEvent[] = []

    constructor(fixtureURL: string) {
        this.fixtureURL = fixtureURL
    }

    public async init() {
        const response = await fetch(this.fixtureURL)

        if (!response.ok) {
            throw new Error(`测试数据加载失败：${this.fixtureURL} (${response.status})`)
        }

        const fixture: FixtureData = await response.json()

        const friends: Friend[] = fixture.fight.friends.map(friend => ({
            id: friend.id,
            name: friend.name,
            job: friend.jobKey in JOBS ? JOBS[friend.jobKey] : JOBS.Unknown,
        }))

        const pets: Pet[] = fixture.fight.pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            ownerID: pet.ownerID,
        }))

        this.reportID = fixture.fight.reportID
        this.fightID = fixture.fight.fightID
        this.fight = {
            reportID: fixture.fight.reportID,
            fightID: fixture.fight.fightID,
            zoneID: fixture.fight.zoneID,
            encounter: fixture.fight.encounter,
            start: fixture.fight.start,
            end: fixture.fight.end,
            friends: friends,
            pets: pets,
        }
        this.events = fixture.events
    }

    public formatTimestamp = (time: number) => {
        const elapsed = time - this.fight.start
        return formatTimestamp(elapsed)
    }

    public async * getEvents(): AsyncGenerator<FFLogsEvent, void, undefined> {
        for (const event of this.events) {
            yield event
        }
    }
}
