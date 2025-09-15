/*
 * @Autor: jiangzupei
 * @Description:
 * @Date: 2025-06-30 17:24:04
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-15 09:56:52
 * @FilePath: /orange-man/src/views/ware/constants.ts
 */
export enum TAB_ID {
  ALL = 'all',
  ONSALE = 'onsale',
  OFFLINE = 'offline',
}

export const enum PRODUCT_STATUS {
  WAIT_PUB = 1, // 待发布
  WAIT_AUDIT = 2, // 待审核
  WAIT_ON_SHELF = 3, // 待审核
  AUDIT_REJECT = 4, // 审核驳回
  IS_ON_SHELF = 5, // 已上架
  IS_OFF_SHELF = 6, // 已下架
}

export const PRODUCT_STATUS_LIST = [
  { label: '待发布', value: 1 },
  { label: '待审核', value: 2 },
  { label: '待上架', value: 3 },
  { label: '审核驳回', value: 4 },
  { label: '已上架', value: 5 },
  { label: '已下架', value: 6 },
]

// 检测报告类型
export enum REPORT_TYPE {
  IMG = 1, // 图片
  FILE = 2, // pdf文件
}

export const REPORT_TYPE_LIST = [
  { label: '图片', value: 1 },
  { label: 'pdf', value: 2 },
]

// 规格
export enum SPEC_TYPE {
  WEIGHT = 1, // 斤
  AMOUNT = 2, // 件
}

export const SPEC_NAME = {
  [SPEC_TYPE.WEIGHT]: '斤',
  [SPEC_TYPE.AMOUNT]: '件',
}
