import request, { BASE_API_URL } from '../server'

/**
 * @description: 获取文件地址
 */
export const getFileUrl: any = (path: string) => {
  return request.post(`${BASE_API_URL}/admin/file/getFileUrl?path=${path}`)
}
