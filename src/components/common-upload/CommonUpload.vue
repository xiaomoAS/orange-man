<template>
  <div class="common-upload">
    <el-upload
      :accept="acceptType"
      :multiple="multiple"
      :limit="limit"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :list-type="listType"
      :disabled="disabled"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :http-request="customUpload"
      :class="{ 'upload-disabled': disabled, 'video-upload': props?.type === 'video' }"
    >
      <template #trigger>
        <slot name="trigger">
          <el-button type="primary" :disabled="disabled">
            <el-icon><UploadFilled /></el-icon>
            {{ buttonText }}
          </el-button>
        </slot>
      </template>

      <template #tip>
        <slot name="tip">
          <div class="el-upload__tip">
            {{ tipText }}
          </div>
        </slot>
      </template>

      <!-- <template v-if="type === 'image'" #default>
        <slot name="default">
          <div class="image-uploader-plus" v-if="listType === 'picture-card'">
            <el-icon><Plus /></el-icon>
          </div>
        </slot>
      </template> -->
    </el-upload>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" :title="previewTitle">
      <div class="preview-container">
        <!-- 图片预览 -->
        <div v-if="type === 'image' && previewUrl">
          <el-image
            style="width: 100px; height: 100px"
            :src="previewUrl"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[previewUrl]"
            fit="cover"
          />
          <div>点击图片放大预览</div>
        </div>

        <!-- 视频预览 -->
        <video v-if="type === 'video' && previewUrl" :src="previewUrl" class="preview-video" controls></video>

        <!-- 文件预览（显示文件名） -->
        <div v-if="type === 'file' && previewFile" class="preview-file">
          <el-icon class="file-icon"><Files /></el-icon>
          <span>{{ previewFile.name }}</span>
          <div class="file-info">
            <span>{{ formatFileSize(previewFile.size || 0) }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadUserFile, UploadRequestOptions } from 'element-plus'
import axios from 'axios'
import { BASE_API_URL } from '@/api/server'

// 定义组件属性
interface Props {
  /**
   * 上传类型：image-图片，video-视频，file-文件
   */
  type?: 'image' | 'video' | 'file' | 'pdf'
  /**
   * 上传地址
   */
  action?: string
  /**
   * 是否支持多选
   */
  multiple?: boolean
  /**
   * 最大上传数量
   */
  limit?: number
  /**
   * 是否自动上传
   */
  autoUpload?: boolean
  /**
   * 按钮文本
   */
  buttonText?: string
  /**
   * 提示文本
   */
  tipText?: string
  /**
   * 文件列表
   */
  fileList?: UploadUserFile[]
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 最大文件大小（MB）
   */
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'image',
  multiple: false,
  limit: 1,
  autoUpload: true,
  buttonText: '点击上传',
  tipText: '',
  fileList: () => [],
  disabled: false,
  maxSize: 5,
  action: `${BASE_API_URL}/admin/file/upload`,
})

// 定义事件
const emit = defineEmits(['update:fileList', 'success', 'error', 'exceed', 'remove', 'change', 'preview'])
// 预览相关
const previewVisible = ref(false)
const previewUrl = ref('')
const previewTitle = ref('')
const previewFile = ref<UploadFile | null>(null)

// 根据上传类型计算接受的文件类型
const acceptType = computed(() => {
  switch (props.type) {
    case 'image':
      return 'image/jpeg,image/png,image/gif,image/webp'
    case 'video':
      return 'video/mp4,video/webm,video/ogg'
    case 'file':
      return '.doc,.docx,.pdf,.xls,.xlsx,.txt'
    case 'pdf':
      return '.pdf'
    default:
      return ''
  }
})

// 根据上传类型计算列表展示方式
const listType = computed(() => {
  switch (props.type) {
    case 'image':
      return 'picture-card'
    case 'video':
      return 'picture'
    case 'file':
      return 'text'
    default:
      return 'text'
  }
})

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

// 上传前校验
const beforeUpload = (file: File) => {
  // 检查文件类型
  const fileType = file.type
  let isValidType = false

  switch (props.type) {
    case 'image': {
      isValidType = fileType.startsWith('image/')
      if (!isValidType) {
        ElMessage.error('只能上传图片文件!')
        return false
      }
      break
    }
    case 'video': {
      isValidType = fileType.startsWith('video/')
      if (!isValidType) {
        ElMessage.error('只能上传视频文件!')
        return false
      }
      break
    }
    case 'file': {
      // 对于文件类型，我们通过扩展名判断
      const extension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt']
      isValidType = allowedExtensions.includes(extension || '')
      if (!isValidType) {
        ElMessage.error('文件类型不支持!')
        return false
      }
      break
    }
    case 'pdf': {
      // 对于文件类型，我们通过扩展名判断
      const extension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ['pdf']
      isValidType = allowedExtensions.includes(extension || '')
      if (!isValidType) {
        ElMessage.error('只支持pdf文件!')
        return false
      }
      break
    }
  }

  // 检查文件大小
  const isLessThanMaxSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLessThanMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB!`)
    return false
  }

  return isValidType && isLessThanMaxSize
}

// 处理预览
const handlePreview = (file: UploadFile) => {
  console.log('file1', Object.prototype.toString.call(file).split(' ')[1].split(']')[0], '===', file, props?.type)
  previewFile.value = file
  previewTitle.value = file.name

  if (props.type === 'image' || props.type === 'video') {
    previewUrl.value = file.url || URL.createObjectURL(file.raw!)
    previewVisible.value = true
  } else if (props.type === 'file' || 'pdf') {
    // 对于文件类型，可以直接打开或下载
    if (file.response) {
      window.open(file.response as string)
    }
  }

  emit('preview', file)
}

// 处理移除
const handleRemove = (file: UploadFile, fileList: UploadFiles) => {
  emit('update:fileList', fileList)
  emit('remove', file, fileList)
}

// 处理上传成功
const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  emit('update:fileList', fileList)
  emit('success', response, file, fileList)
}

// 处理上传失败
const handleError = (error: Error, file: UploadFile, fileList: UploadFiles) => {
  emit('error', error, file, fileList)
}

// 处理超出限制
const handleExceed = (files: File[], fileList: UploadFiles) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
  emit('exceed', files, fileList)
}

// 处理文件状态改变
const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  emit('update:fileList', fileList)
  emit('change', file, fileList)
}

// 自定义上传方法
const customUpload = async (options: UploadRequestOptions) => {
  const { file, onSuccess, onError, onProgress } = options
  console.log('file', Object.prototype.toString.call(file).split(' ')[1].split(']')[0], '===', file)

  // 创建一个FileReader来读取文件内容
  const reader = new FileReader()

  reader.onload = async () => {
    try {
      // 获取文件内容（Base64格式）
      const fileContent = reader.result
      // 从localStorage获取token
      const authToken = localStorage.getItem('authToken')

      // 发送请求
      const { data, status } = await axios.post(
        props.action,
        {
          fileContent: fileContent,
          fileName: file?.name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            auth_token: authToken,
          },
          onUploadProgress: (progressEvent) => {
            // 计算上传进度
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              // 简化的进度对象
              onProgress?.({ percent } as any)
            }
          },
        },
      )
      // 上传成功
      if (status === 200 && data.success && data?.data?.url) {
        try {
          // 从响应数据中获取 url
          onSuccess(data?.data?.url)
        } catch {
          onError({
            name: 'Error',
            message: '上传失败',
            status: 500,
            method: 'POST',
            url: props.action,
          })
        }
      } else {
        onError({
          name: 'Error',
          message: '上传失败',
          status: 500,
          method: 'POST',
          url: props.action,
        })
        ElMessage.error('上传失败')
      }
    } catch (error) {
      // 上传失败
      const ajaxError = {
        name: 'Error',
        message: (error as Error).message || '上传失败',
        status: 500,
        method: 'POST',
        url: props.action,
      } as any
      onError(ajaxError)
      ElMessage.error('上传失败')
    }
  }

  reader.onerror = () => {
    // 创建错误对象
    const ajaxError = {
      name: 'Error',
      message: '文件读取失败',
      status: 500,
      method: 'POST',
      url: props.action,
    } as any

    onError(ajaxError)
  }

  // 以Base64格式读取文件
  reader.readAsDataURL(file as File)
}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
