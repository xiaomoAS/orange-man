import axios from 'axios'
import { ElMessage } from 'element-plus'

export const BASE_API_URL = '//test-incentive-api.jd.com'

const server = axios.create({
  withCredentials: true,
})

server.interceptors.response.use(
  (response) => {
    console.error('response', response)

    const { status, data } = response
    if (status === 200 && data.success) {
      return Promise.resolve(data.data)
    }
    ElMessage.error(data.message)
    return Promise.reject(data.message)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default server
