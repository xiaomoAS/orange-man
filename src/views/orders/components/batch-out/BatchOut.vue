<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量出库"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <el-button type="primary" link @click="downloadTemplate">下载模板文件</el-button>

    <div class="title-text">上传批量处理excel文件</div>
    <CommonUpload v-model:fileList="fileList" type="file" :defaultUpload="false" :acceptFileType="['.xls', '.xlsx']" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确定出库</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CommonUpload } from '@/components'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as apis from '@/api/services'

defineOptions({
  title: 'BatchOut',
})

const emit = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const fileList = ref([])
const selectList = ref<Array<any>>([])

const submitHandler = () => {
  if (!fileList.value?.length) {
    ElMessage.warning('请先上传文件')
    return
  }
  const file = (fileList.value?.[0] as any)?.raw

  // 创建一个FileReader来读取文件内容
  const reader = new FileReader()
  // 以Base64格式读取文件
  reader.readAsDataURL(file as File)

  reader.onload = async () => {
    let loading: any = null
    try {
      // 获取文件内容（Base64格式）
      const fileContent = reader.result
      loading = ElLoading.service({
        lock: true,
        text: '生成打印单中...',
      })
      const { waybillInfoList = [], mergeWaybillUrl } = await apis.batchShipment({ file: fileContent })
      loading?.close()
      emit('getTableData')
      const errorList = waybillInfoList?.filter((item) => !item?.success)
      if (errorList?.length) {
        ElMessageBox.confirm(
          `${errorList?.map((item) => `<div>${item?.id}：${item?.errorMsg}</div>`)?.join('')}`,
          `${errorList.length}单出库失败，原因如下`,
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          },
        )
          .then(() => true)
          .catch(() => false)
      } else {
        ElMessage.success('批量出库成功')
      }
      if (mergeWaybillUrl) window.open(mergeWaybillUrl)
      dialogVisible.value = false
    } catch (error) {
      if (loading) loading?.close()
      console.log(error)
    }
  }

  reader.onerror = () => {}
}

const open = (list) => {
  selectList.value = list
  fileList.value = []
  dialogVisible.value = true
}

const closeHandler = () => {}

const downloadTemplate = () => {
  window.open(
    'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E8%BF%90%E5%8D%95%E5%8F%B7%E6%A8%A1%E6%9D%BF.xlsx?Expires=2076866776&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=bcZAumq0S17Emjhr2c9gR8b%2FCws%3D',
  )
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
