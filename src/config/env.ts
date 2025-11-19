/**
 * 环境配置
 * 根据当前环境自动选择对应的API地址和其他配置
 */

// 获取当前环境
export const ENV = {
  // 当前环境
  mode: import.meta.env.VITE_ENV || 'development',

  // API基础URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://8.141.22.102',

  // 是否为开发环境
  isDevelopment: import.meta.env.VITE_ENV === 'development',

  // 是否为生产环境
  isProduction: import.meta.env.VITE_ENV === 'production',

  // 获取完整的API URL
  getApiUrl: (path: string = '') => {
    const baseUrl = ENV.apiBaseUrl
    if (!path) return baseUrl

    // 确保路径以/开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${normalizedPath}`
  },
}

// 导出常用的环境变量
export const { apiBaseUrl, isDevelopment, isProduction, getApiUrl } = ENV
