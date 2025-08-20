import dayjs from 'dayjs'

/**
 * @description 日期格式化
 * @param {any} time 日期或者时间戳
 * @returns {String} 格式化日期
 */
export const formatDate = (time: any, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '-'
  return dayjs(time).format(formatStr)
}
