<template>
  <el-dialog
    v-model="dialogVisible"
    title="打印面单"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="订单号" prop="orderId">
        <el-input v-model="form.orderId" disabled></el-input>
      </el-form-item>
      <el-form-item label="发货地址" prop="shipAddressList">
        <el-cascader v-model="form.shipAddressList" :props="addressProps" />
      </el-form-item>
      <el-form-item label="发货详细地址" prop="shipDetailAddress">
        <el-input v-model="form.shipDetailAddress" placeholder="请输入发货详细地址" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import * as apis from '@/api/services'
import { reactive, ref } from 'vue'
import { ElMessage, type CascaderProps } from 'element-plus'

const emit = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const form = reactive({
  orderId: null,
  shipAddressList: [],
  shipDetailAddress: null,
})
const formRef = ref()
const rules = {
  orderId: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  shipAddressList: [{ required: true, message: '请选择发货地址', trigger: 'change' }],
  shipDetailAddress: [{ required: true, message: '请输入详细发货地址', trigger: 'blur' }],
}

const addressProps: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level, value } = node
    try {
      const list = await apis.getAddress({
        parentId: level > 0 ? value : level,
      })
      const nodes = list?.map((item: { id: number; name: string }) => ({
        value: item?.id,
        label: item?.name,
        leaf: level >= 3,
      }))
      resolve(nodes)
    } catch {
      resolve([])
    }
  },
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const data = await apis?.printWaybill({
        orderId: form?.orderId,
        waybillCompanyCode: 1, // 物流公司编码（暂时固定传1）
        shipAddress: {
          provinceId: form?.shipAddressList?.[0],
          cityId: form?.shipAddressList?.[1],
          countyId: form?.shipAddressList?.[2],
          townId: form?.shipAddressList?.[3],
          detail: form?.shipDetailAddress,
        },
      })
      if (data) {
        ElMessage.success('打印面单成功')
        window.open(data)
        emit('getTableData')
        dialogVisible.value = false
      }
    } catch {}
  })
}

const closeHandler = () => {
  Object.assign(form, {
    orderId: null,
    shipAddressList: [],
    shipDetailAddress: null,
  })
}

const open = (row: Record<string, any>) => {
  rowData.value = row
  form.orderId = row?.id
  dialogVisible.value = true
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
