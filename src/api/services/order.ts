import request, { BASE_API_URL } from '../server'

/**
 * @description: 订单列表
 */
export const getOrderList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/list`, params)
}

/**
 * @description: 上传运单
 */
export const orderShipment: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/waybill/shipment`, params)
}

/**
 * @description: 取消运单
 */
export const cancelOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/cancel`, params)
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
