import request, { BASE_API_URL } from '../server'

export const getOrderList = (params = {}) => {
  return request.post(`${BASE_API_URL}/`, params)
}
