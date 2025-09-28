import request, { BASE_API_URL } from '../server'

/**
 * @description: 优惠券列表
 */
export const getCouponList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/coupon/list`, params)
}

/**
 * @description: 停用优惠券
 */
export const closeCoupon: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/coupon/close`, params)
}

/**
 * @description: 启用优惠券
 */
export const openCoupon: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/coupon/open`, params)
}

/**
 * @description: 更新优惠券
 */
export const updateCoupon: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/coupon/update`, params)
}

/**
 * @description: 新增优惠券
 */
export const addCoupon: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/coupon/add`, params)
}
