import request, { BASE_API_URL } from '../server'

export const getOrderList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/list`, params)
}

/**
 * @description: 上传运单
 */
export const uploadWaybill: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/uploadWaybill`, params)
}

/**
 * @description: 取消运单
 */
export const cancelOrder: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/order/cancel`, params)
}
