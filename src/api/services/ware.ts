import request, { BASE_API_URL } from '../server'

/**
 * @description: 商品列表接口
 */
export const getWareList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/product/list`, params)
}
