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

/**
 * @description: 暂停团长身份
 */
export const pauseLeader: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/team/leader/pause`, params)
}

/**
 * @description: 删除团长
 */
export const deleteLeader: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/team/leader/delete`, params)
}
