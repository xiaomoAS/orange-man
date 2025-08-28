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
  SHOW = 1, // 展示
  HIDE = 2, // 隐藏
}

export const CATE_STATUS_NAME = {
  [CATE_STATUS.SHOW]: '展示',
  [CATE_STATUS.HIDE]: '隐藏',
}
