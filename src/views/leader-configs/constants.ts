// 团长等级
export enum LEADER_LEVEL {
  NORMAL = 1, // 普通
  GOLD = 2, // 黄金
  PLATINUM = 3, // 铂金
  DIAMOND = 4, // 钻石
}

export const LEADER_LEVEL_LIST = [
  {
    label: '普通团长',
    value: LEADER_LEVEL.NORMAL,
  },
  {
    label: '黄金团长',
    value: LEADER_LEVEL.GOLD,
  },
  {
    label: '铂金团长',
    value: LEADER_LEVEL.PLATINUM,
  },
  {
    label: '钻石团长',
    value: LEADER_LEVEL.DIAMOND,
  },
]
