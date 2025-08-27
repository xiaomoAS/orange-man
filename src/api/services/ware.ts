import request, { BASE_API_URL } from '../server'

/**
 * @description: 商品列表接口
 */
export const getWareList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/list`, params)
}

/**
 * @description: 商品上架接口
 */
export const wareOnline: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/online`, params)
}

/**
 * @description: 商品下架接口
 */
export const wareOffline: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/offline`, params)
}

/**
 * @description: 商品删除接口
 */
export const wareDelete: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/delete`, params)
}

/**
 * @description: 修改商品检测报告接口
 */
export const updateReport: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/report/update`, params)
}

/**
 * @description: 添加商品接口
 */
export const addProduct: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/add`, params)
}
