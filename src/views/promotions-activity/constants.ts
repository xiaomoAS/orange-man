// 活动投放渠道
export enum WAY_TYPE {
  ONLINE = 1, // 线上
}

export const WAY_TYPE_MAP = {
  [WAY_TYPE.ONLINE]: '线上',
}

// 活动状态
export enum ACTIVITY_STATUS {
  NO = 0, // 关闭
  ACTIVE = 1, // 开启
}

export const ACTIVITY_STATUS_MAP = {
  [ACTIVITY_STATUS.NO]: '关闭',
  [ACTIVITY_STATUS.ACTIVE]: '开启',
}
