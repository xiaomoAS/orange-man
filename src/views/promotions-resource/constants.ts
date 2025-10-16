// 资源位类型
export enum RESOURCE_TYPE {
  IMG = 1, // 图片
  VIDEO = 2, // 视频
}

export const RESOURCE_NAME_MAP = {
  [RESOURCE_TYPE.IMG]: '图片',
  // [RESOURCE_TYPE.VIDEO]: '视频',
}

export const RESOURCE_TYPE_LIST = [
  {
    label: '图片',
    value: RESOURCE_TYPE.IMG,
  },
  // {
  //   label: '视频',
  //   value: RESOURCE_TYPE.VIDEO,
  // },
]

// 资源位位置类型
export enum AREA_TYPE {
  CAROUSEL = 1, // 首页轮播
  FLOOR = 2, // 普通资源位
}

export const AREA_NAME_MAP = {
  [AREA_TYPE.CAROUSEL]: '首页轮播',
  [AREA_TYPE.FLOOR]: '普通资源位',
}

export const AREA_TYPE_LIST = [
  {
    value: AREA_TYPE.CAROUSEL,
    label: '首页轮播',
  },
  {
    value: AREA_TYPE.FLOOR,
    label: '普通资源位',
  },
]

// 资源位链接类型
export enum RESOURCE_LINK_TYPE {
  MINI = 1, // 小程序
  OFFICIAL = 2, // 公众号
}

// 资源位链接
export const RESOURCE_LINK_LIST = [
  { label: '小程序', value: RESOURCE_LINK_TYPE.MINI },
  { label: '公众号', value: RESOURCE_LINK_TYPE.OFFICIAL },
]
