// 活动投放渠道
export enum WAY_TYPE {
  ONLINE = 1, // 线上
}

export const WAY_TYPE_MAP = {
  [WAY_TYPE.ONLINE]: '线上',
}

// 活动状态
export enum ACTIVITY_STATUS {
  WAIT_PUB = 1, // 待发布
  WAIT_AUDIT = 2, // 待审核
  WAIT_ACTIVE = 3, // 待生效
  AUDIT_REJECT = 4, // 审核驳回
  ACTIVE = 5, // 已生效
  CLOSED = 6, // 已关闭
}

export const ACTIVITY_STATUS_MAP = {
  [ACTIVITY_STATUS.WAIT_PUB]: '待发放',
  [ACTIVITY_STATUS.WAIT_AUDIT]: '待审核',
  [ACTIVITY_STATUS.WAIT_ACTIVE]: '待生效',
  [ACTIVITY_STATUS.AUDIT_REJECT]: '审核驳回',
  [ACTIVITY_STATUS.ACTIVE]: '已生效',
  [ACTIVITY_STATUS.CLOSED]: '已关闭',
}
