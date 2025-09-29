/*
 * @Autor: jiangzupei
 * @Description:
 * @Date: 2025-06-30 17:24:04
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-09-29 14:08:39
 * @FilePath: /orange-man/src/views/orders/constants.ts
 */
export enum TAB_ID {
  ALL = 'all', // 全部
  NOT_PAY = 'notPay', // 待付款
  WAIT_OUT = 'waitout', // 待出库
  HAS_OUT = 'hasout', // 待出库
}

export enum ORDER_STATUS {
  WAIT_PAY = 1, // 待付款
  WAIT_OUT = 2, // 待出库
  HAS_OUT = 3, // 待收货
  COMPLETED = 4, // 已完成
  CANCELED = 9, // 已取消
}

export const ORDER_STATUS_LIST = [
  {
    label: '待付款',
    value: ORDER_STATUS.WAIT_PAY,
  },
  {
    label: '待出库',
    value: ORDER_STATUS.WAIT_OUT,
  },
  {
    label: '待收货',
    value: ORDER_STATUS.HAS_OUT,
  },
  {
    label: '已完成',
    value: ORDER_STATUS.COMPLETED,
  },
  {
    label: '已取消',
    value: ORDER_STATUS.CANCELED,
  },
]
