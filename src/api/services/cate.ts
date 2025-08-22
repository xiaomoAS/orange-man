import request, { BASE_API_URL } from '../server'

/**
 * @description: 类目list
 */
export const getCateList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/category/list`, params)
}

/**
 * @description: 添加类目
 */
export const addCate: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/category/add`, params)
}

/**
 * @description: 更新类目
 */
export const updateCate: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/category/update`, params)
}

/**
 * @description: 删除类目
 */
export const deleteCate: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/category/delete`, params)
}
