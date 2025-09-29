<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传运单号"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div>
      <el-form ref="waybillFormRef" :model="waybillForm" :rules="rules" label-width="120px">
        <el-form-item label="运单号" prop="waybillNumber">
          <el-input v-model="waybillForm.waybillNumber" placeholder="请输入运单号"></el-input>
        </el-form-item>
        <el-form-item label="物流公司名称" prop="waybillCompanyName">
          <el-input v-model="waybillForm.waybillCompanyName" placeholder="请输入物流公司名称"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'

// interface Props {
//   orderId: number | null
// }

// withDefaults(defineProps<Props>(), {
//   orderId: null,
// })

const rules = {
  waybillNumber: [{ required: true, message: '请输入运单号', trigger: 'blur' }],
  waybillCompanyName: [{ required: true, message: '请输入物流公司名称', trigger: 'blur' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const waybillFormRef = ref()
const waybillForm = reactive({
  waybillNumber: null,
  waybillCompanyName: null,
})

const open = (data: Record<string, any>) => {
  rowData.value = data
  dialogVisible.value = true
}

const closeHandler = () => {
  waybillFormRef.value?.resetFields()
  Object.assign(waybillForm, {
    waybillNumber: null,
    waybillCompanyName: null,
  })
}

const submitHandler = () => {
  waybillFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const res = await apis.uploadWaybill({
        orderId: Number(rowData.value?.orderId),
        ...waybillForm,
      })
      if (res) {
        ElMessage.success('上传成功')
        emits('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('上传失败')
      }
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
