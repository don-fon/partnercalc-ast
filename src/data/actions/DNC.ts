import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DNC_ACTIONS = preserve<Action>()({
    DOUBLE_STANDARD_FINISH: {
        name: '双色标准舞步结束',
        id: 16192,
        potency: 850,
        falloff: true,
    },
    QUADRUPLE_TECHNICAL_FINISH: {
        name: '四色技巧舞步结束',
        id: 16196,
        potency: 1300,
        falloff: true,
    },
    CASCADE: {
        name: '瀑泻(1)',
        id: 15989,
        potency: 220,
        generatesEsprit: true,
    },
    FOUNTAIN: {
        name: '喷泉(2)',
        id: 15990,
        potency: 280,
        generatesEsprit: true,
    },
    REVERSE_CASCADE: {
        name: '逆瀑泻(3)',
        id: 15991,
        potency: 280,
        generatesEsprit: true,
    },
    FOUNTAINFALL: {
        name: '坠喷泉(4)',
        id: 15992,
        potency: 340,
        generatesEsprit: true,
    },
    WINDMILL: {
        name: '风车(1)',
        id: 15993,
        potency: 100,
        generatesEsprit: true,
    },
    BLADESHOWER: {
        name: '落刃雨(2)',
        id: 15994,
        potency: 140,
        generatesEsprit: true,
    },
    RISING_WINDMILL: {
        name: '升风车(3)',
        id: 15995,
        potency: 140,
        generatesEsprit: true,
    },
    BLOODSHOWER: {
        name: '落血雨(4)',
        id: 15996,
        potency: 180,
        generatesEsprit: true,
    },
    SABER_DANCE: {
        name: '剑舞',
        id: 16005,
        potency: 520,
        falloff: true,
    },
    FAN_DANCE: {
        name: '扇舞·序(1)',
        id: 16007,
        potency: 150,
    },
    FAN_DANCE_II: {
        name: '扇舞·破(2)',
        id: 16008,
        potency: 100,
    },
    FAN_DANCE_III: {
        name: '扇舞·急(3)',
        id: 16009,
        potency: 200,
        falloff: true,
    },
    FAN_DANCE_IV: {
        name: '扇舞·终(4)',
        id: 25791,
        potency: 300,
        falloff: true,
    },
    TILLANA: {
        name: '提拉纳',
        id: 25790,
        potency: 600,
        falloff: true,
    },
    STARFALL_DANCE: {
        name: '流星舞',
        id: 25792,
        potency: 600,
        falloff: true,
        autoCrit: true,
        autoDH: true,
    },
    DEVILMENT: {
        name: '进攻之探戈',
        id: 16011,
    },
    CLOSED_POSITION: {
        name: '闭式舞姿',
        id: 16006,
    },
    LAST_DANCE: {
        name: '落幕舞',
        id: 36983,
        potency: 520,
        falloff: true,
    },
    FINISHING_MOVE: {
        name: '结束动作',
        id: 36984,
        potency: 850,
        falloff: true,
    },
    DANCE_OF_THE_DAWN: {
        name: '拂晓舞',
        id: 36985,
        potency: 1000,
        falloff: true,
    },
})
