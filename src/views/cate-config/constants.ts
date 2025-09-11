export enum CATE_TYPE {
  NORMAL = 1, // 普通
  ACTIVITY = 2, // 活动
}

export const CATE_TYPE_LIST = [
  {
    label: '普通',
    value: CATE_TYPE.NORMAL,
  },
  {
    label: '活动',
    value: CATE_TYPE.ACTIVITY,
  },
]

export enum CATE_STATUS {
  ONLINE = 1, // 上线
  OFFLINE = 10, // 下线
}

export const CATE_STATUS_NAME = {
  [CATE_STATUS.ONLINE]: '上线',
  [CATE_STATUS.OFFLINE]: '下线',
}
