<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增类目"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div v-if="dialogVisible">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="isEdit" label="类目ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入类目ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类目名称"></el-input>
        </el-form-item>
        <el-form-item label="类目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类目类型">
            <el-option v-for="item in CATE_TYPE_LIST" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="logo图片" prop="logoFiles">
          <CommonUpload v-model:fileList="form.logoFiles" @change="validateField('logoFiles')" />
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
import { ref, reactive, computed } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { CommonUpload } from '@/components'
import { CATE_TYPE_LIST } from '../../constants'

const rules = {
  name: [{ required: true, message: '请输入类目名称', trigger: 'change' }],
  type: [{ required: true, message: '请选择类目类型', trigger: 'change' }],
  logoFiles: [{ required: true, message: '请上传logo图片', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive<Record<string, any>>({
  id: undefined,
  name: null,
  type: null,
  logoFiles: [],
})
const isEdit = computed(() => !!rowData.value)

const open = (data: Record<string, any>) => {
  rowData.value = data
  Object.assign(form, data)
  form.logoFiles = data?.logoUrl
    ? [
        {
          name: data?.name,
          url: data?.logoUrl,
          response: data?.logoUrl,
        },
      ]
    : []
  dialogVisible.value = true
}

const closeHandler = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: undefined,
    name: null,
    type: null,
    logoFiles: [],
  })
}

// 手动触发表单验证
const validateField = (field: string) => {
  formRef.value?.validateField(field)
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateCate' : 'addCate'
      const res = await apis?.[apiName]({
        id: rowData.value?.id,
        name: form?.name,
        type: form?.type,
        logoUrl: form?.logoFiles?.[0]?.response,
      })
      if (res) {
        ElMessage.success('添加成功')
        emits('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('添加失败')
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
