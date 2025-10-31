import request, { BASE_API_URL } from '../server'

/**
 * @description: 订单列表
 */
export const getOrderList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/list`, params)
}

/**
 * @description: 单个出库
 */
export const orderShipment: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/waybill/shipment`, params)
}

/**
 * @description: 批量出库
 */
export const batchShipment: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/waybill/batchShipment`, params)
}

/**
 * @description: 取消订单
 */
export const cancelOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/cancel`, params)
}

/**
 * @description: 退款订单
 */
export const refundOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/refund`, params)
}

/**
 * @description: 取消运单
 */
export const receiveOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/receive`, params)
}

/**
 * @description: 打印面单
 */
export const printWaybill: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/printWaybill`, params)
}

/**
 * @description: 打印出库单
 */
export const printOutOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/waybill/getPickInfo`, params)
}

/**
 * @description: 获取地址
 */
export const getAddress: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/address/list`, params)
}

/**
 * @description: 获取地址
 */
export const getWaybillList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/waybill/company/list`, params)
}

/**
 * @description: 保存备注
 */
export const saveRemark: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/saveRemark`, params)
}

/**
 * @description: 订单导出
 */
export const exportOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/exportOrder`, params)
}
