import request, { BASE_API_URL } from '../server'

/**
 * @description: 类目list
 */
export const getCatelList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/category/list`, params)
}
