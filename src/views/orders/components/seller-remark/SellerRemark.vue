<template>
  <div class="">
    <template v-if="!isEdit">
      <el-icon class="edit-icon" color="#8F8F8F" :size="14" @click="editHandler"><Edit /></el-icon>
      <span>{{ rowData?.sellerRemark || '-' }}</span>
    </template>
    <template v-else>
      <el-input v-model="newRemark"></el-input>
      <div class="remark-buttons">
        <el-button type="primary" size="small" @click="submitHandler">确定</el-button>
        <el-button size="small" @click="isEdit = false">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'

defineOptions({
  title: 'SellerRemark',
})

interface Props {
  rowData: Record<string, any>
}
const emit = defineEmits(['getTableData'])
const props = withDefaults(defineProps<Props>(), {
  rowData: () => ({}),
})

const isEdit = ref<boolean>(false)
const newRemark = ref<string>('')

const editHandler = () => {
  newRemark.value = props?.rowData?.sellerRemark
  isEdit.value = true
}

const submitHandler = async () => {
  try {
    await apis?.saveRemark({
      orderId: props?.rowData?.id,
      remark: newRemark.value,
    })
    ElMessage.success('保存成功')
    isEdit.value = false
    emit('getTableData')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
