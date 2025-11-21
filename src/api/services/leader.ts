import request, { BASE_API_URL } from '../server'

/**
 * @description: 团长列表查询
 */
export const getLeaderList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/team/leader/list`, params)
}

/**
 * @description: 增加团长
 */
export const addLeader: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/team/leader/add`, params)
}

/**
 * @description: 更新团长
 */
export const updateLeader: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/team/leader/update`, params)
}
