import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// 路由
const router = useRouter()

export const BASE_API_URL = '//101.201.111.162'

const server = axios.create({
  withCredentials: true,
})

// 请求拦截器：添加auth_token到请求头
server.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const authToken = localStorage.getItem('authToken')

    // 如果存在token，则添加到请求头
    if (authToken) {
      config.headers['auth_token'] = authToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    const { status, data } = response
    if (status === 200) {
      //
      if (data?.code === 201) {
        // 跳转到首页或其他页面
        router.push('/login')
        ElMessage.warning('登录过期，请重新登录')
        return Promise.reject()
      }
      if (data.success) {
        return Promise.resolve(data.data)
      }
    }
    ElMessage.error(data.message)
    return Promise.reject(data.message)
  },
  (error) => {
    ElMessage.error(error)
    return Promise.reject(error)
  },
)

export default server
