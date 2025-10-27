<template>
  <el-dialog
    v-model="dialogVisible"
    title="出库"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div>
      <el-form ref="waybillFormRef" :model="waybillForm" :rules="rules" label-width="120px">
        <el-form-item label="物流公司" prop="companyCode">
          <el-select v-model="waybillForm.companyCode" placeholder="请选择物流公司" clearable>
            <el-option
              v-for="item in companyList"
              :key="item?.companyCode"
              :label="item?.companyName"
              :value="item?.companyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="waybillForm.companyCode && waybillForm.companyCode !== COMPANY_CODE.CJZS"
          label="运单号"
          prop="waybillCode"
        >
          <el-input v-model="waybillForm.waybillCode" placeholder="请输入运单号"></el-input>
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
import { ref, reactive, onMounted } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { COMPANY_CODE } from './constants'

const rules = {
  waybillCode: [{ required: true, message: '请输入运单号', trigger: 'blur' }],
  companyCode: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const companyList = ref<Array<any>>([])
const waybillFormRef = ref()
const waybillForm = reactive({
  waybillCode: null,
  companyCode: null,
})

const open = (data: Record<string, any>) => {
  rowData.value = data
  dialogVisible.value = true
}

const closeHandler = () => {
  waybillFormRef.value?.resetFields()
  Object.assign(waybillForm, {
    waybillCode: null,
    companyCode: null,
  })
}

const submitHandler = () => {
  waybillFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const res = await apis.orderShipment({
        orderId: Number(rowData.value?.id),
        ...waybillForm,
        companyName: companyList.value?.find((item) => item.companyCode === waybillForm.companyCode)?.companyName,
      })
      if (res) {
        ElMessage.success('出库成功')
        if (res?.waybillUrl) {
          window.open(res?.waybillUrl)
        }
        emits('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('出库失败')
      }
    } catch (error) {
      console.log(error)
    }
  })
}

const getWaybillList = async () => {
  try {
    companyList.value = await apis.getWaybillList({})
  } catch {
    companyList.value = []
  }
}

onMounted(() => {
  getWaybillList()
})

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
