import request, { BASE_API_URL } from '../server'

/**
 * @description: 获取资源位list
 */
export const getResourceList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/resource/list`, params)
}

/**
 * @description: 编辑资源位
 */
export const updateResource: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/resource/update`, params)
}

/**
 * @description: 新增资源位 TODO: 接口名
 */
export const addResource: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/resource/add`, params)
}

/**
 * @description: 删除资源位
 */
export const deleteResource: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/resource/delete`, params)
}

/**
 * @description: 营销活动场list
 */
export const getActivityList: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/activity/list`, params)
}

/**
 * @description: 开启活动
 */
export const openActivity: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/activity/open`, params)
}

/**
 * @description: 关闭活动
 */
export const closeActivity: any = (params = {}) => {
  return request.post(`${BASE_API_URL}/admin/activity/close`, params)
}
