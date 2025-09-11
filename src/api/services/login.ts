import request, { BASE_API_URL } from '../server'

/**
 * @description: 用户登陆
 */
export const userLogin: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/user/login`, params)
}

/**
 * @description: 添加用户
 */
export const addUser: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/user/add`, params)
}

/**
 * @description:修改用户
 */
export const updateUser: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/user/update`, params)
}

/**
 * @description: 权限用户列表
 */
export const getUserList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/user/list`, params)
}

/**
 * @description: 删除用户
 */
export const deleteUser: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/user/delete`, params)
}
