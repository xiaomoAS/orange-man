// 资源位类型
export enum RESOURCE_TYPE {
  IMG = 1, // 图片
  VIDEO = 2, // 视频
}

export const RESOURCE_NAME_MAP = {
  [RESOURCE_TYPE.IMG]: '图片',
  [RESOURCE_TYPE.VIDEO]: '视频',
}

export const RESOURCE_TYPE_LIST = [
  {
    label: '图片',
    value: RESOURCE_TYPE.IMG,
  },
  {
    label: '视频',
    value: RESOURCE_TYPE.VIDEO,
  },
]

// 资源位位置类型
export enum AREA_TYPE {
  CAROUSEL = 1, // 轮播
  FLOOR = 2, // 楼层
}

export const AREA_NAME_MAP = {
  [AREA_TYPE.CAROUSEL]: '轮播',
  [AREA_TYPE.FLOOR]: '楼层',
}

export const AREA_TYPE_LIST = [
  {
    value: AREA_TYPE.CAROUSEL,
    label: '轮播',
  },
  {
    value: AREA_TYPE.FLOOR,
    label: '楼层',
  },
]
