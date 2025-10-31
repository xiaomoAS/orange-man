<template>
  <el-drawer v-model="visible" title="订单导出" size="900" class="export-drawer">
    <div class="export-box">
      <div class="export-box__title">导出条件</div>
      <div class="export-content">
        <div
          v-for="config in exportConfigs"
          :key="config.field"
          class="export-item"
          :style="{ width: `${(config.span || 1) * 32}%` }"
        >
          <span class="export-item__label">{{ config.label }}：</span>
          <span class="export-item__text">{{ formatExportValue(config) }}</span>
        </div>
      </div>

      <div class="export-buttons">
        <el-button type="primary" @click="exportHandler">确定导出</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@/utils/index.ts'
import { ElLoading, ElMessage } from 'element-plus'
import * as apis from '@/api/services'

interface Props {
  exportConfigs?: Array<{
    field: string
    label: string
    value?: any
    type: string
    span?: number
    options?: Array<any>
  }>
}

const props = withDefaults(defineProps<Props>(), {
  exportConfigs: () => [],
})

const visible = ref<boolean>(false)

const formatExportValue = (config) => {
  if (!config?.value || (config.type === 'dateRange' && !config?.value?.length)) return '全部'
  switch (config.type) {
    case 'input':
      return config.value
    case 'select':
      return config?.options?.find((item) => item.value === config.value)?.label || config.value
    case 'date':
      return formatDate(config.value)
    case 'dateRange':
      return config.value?.map((item) => formatDate(item))?.join(' 至 ')
    default:
      return config.value
  }
}

const exportHandler = async () => {
  let loading: any = null
  try {
    loading = ElLoading.service({
      lock: true,
      text: '导出订单中...',
    })
    const { exportUrl } = await apis.exportOrder(
      props?.exportConfigs?.reduce((param, item) => ({ ...param, [item.field]: item.value }), {}),
    )
    if (exportUrl) {
      ElMessage.success('导出成功')
      window.open(exportUrl)
    }
  } catch (error) {
    console.log(error)
  }
  loading?.close()
}

const open = () => {
  visible.value = true
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
<style lang="scss">
.export-drawer {
  .el-drawer__title {
    font-weight: 600;
    font-size: 18px;
  }
}
</style>
