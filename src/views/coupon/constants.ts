// 券类型
export enum COUPON_TYPE {
  NEW_DISCOUNT = 1, // 专享券
  FREIGHT = 2, // 包邮券
}

export const COUPON_NAME_MAP = {
  [COUPON_TYPE.NEW_DISCOUNT]: '专享券',
  [COUPON_TYPE.FREIGHT]: '包邮券',
}

export const COUPON_LIST = [
  {
    label: '专享券',
    value: COUPON_TYPE.NEW_DISCOUNT,
  },
  {
    label: '包邮券',
    value: COUPON_TYPE.FREIGHT,
  },
]

// 优惠券状态
export enum COUPON_STATUS {
  WAIT_PUB = 1, // 待发放
  WAIT_AUDIT = 2, // 待审核
  WAIT_ACTIVE = 3, // 待生效
  AUDIT_REJECT = 4, // 审核驳回
  ACTIVE = 5, // 已生效
  CLOSED = 6, // 已关闭
}

export const STATUS_NAME_MAP = {
  [COUPON_STATUS.WAIT_PUB]: '待发放',
  [COUPON_STATUS.WAIT_AUDIT]: '待审核',
  [COUPON_STATUS.WAIT_ACTIVE]: '待生效',
  [COUPON_STATUS.AUDIT_REJECT]: '审核驳回',
  [COUPON_STATUS.ACTIVE]: '已生效',
  [COUPON_STATUS.CLOSED]: '已关闭',
}

export const COUPON_STATUS_LIST = [
  { label: '待发放', value: COUPON_STATUS.WAIT_PUB },
  { label: '已生效', value: COUPON_STATUS.ACTIVE },
  { label: '已关闭', value: COUPON_STATUS.CLOSED },
]

// 发放方式
export enum PUBLISH_TYPE {
  NEW = 1, // 新用户进入小程序领取
  DISCOUNT_DAILY = 3, // 每日折扣券
  LINK = 4, // 分享二维码领取
}

// 所有发放方式
export const ALL_PUBLISH_LIST = [
  { label: '新用户进入小程序领取', value: PUBLISH_TYPE.NEW },
  { label: '每日折扣券', value: PUBLISH_TYPE.DISCOUNT_DAILY },
  { label: '分享二维码领取', value: PUBLISH_TYPE.LINK },
]

// 专享券发放方式
export const NEW_PUBLISH_LIST = [
  { label: '新用户进入小程序领取', value: PUBLISH_TYPE.NEW },
  { label: '每日折扣券', value: PUBLISH_TYPE.DISCOUNT_DAILY },
  { label: '分享二维码领取', value: PUBLISH_TYPE.LINK },
]

// 运费券发放方式
export const FREIGHT_PUBLISH_LIST = [
  { label: '新用户进入小程序领取', value: PUBLISH_TYPE.NEW },
  { label: '分享二维码领取', value: PUBLISH_TYPE.LINK },
]
