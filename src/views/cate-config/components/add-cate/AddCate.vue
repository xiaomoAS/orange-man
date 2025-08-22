<template>
  <el-dialog v-model="dialogVisible" title="新增类目" @close="closeHandler">
    <div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="isEdit" label="类目ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入类目ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类目名称"></el-input>
        </el-form-item>
        <el-form-item label="类目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类目类型">
            <el-option
              v-for="item in CATE_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父类目id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父类目id"></el-input>
        </el-form-item>
        <el-form-item label="logoUrl" prop="logoUrl">
          <!-- TODO: 上传 -->
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
import { CATE_TYPE_LIST } from './constants'

const rules = {
  name: [{ required: true, message: '请输入类目名称', trigger: 'change' }],
  type: [{ required: true, message: '请选择类目类型', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive({
  id: undefined,
  name: null,
  type: null,
  parentId: null,
})
const isEdit = computed(() => rowData.value)

const open = (data: Record<string, any>) => {
  rowData.value = data
  Object.assign(form, data)
  dialogVisible.value = true
}

const closeHandler = () => {
  formRef.value?.resetFields()
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateCate' : 'addCate'
      const res = await apis?.[apiName]({
        ...form,
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
