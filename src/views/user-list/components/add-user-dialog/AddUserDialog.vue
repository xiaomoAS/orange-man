<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '修改用户' : '添加用户'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
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

const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive<Record<string, any>>({
  userName: null,
  password: null,
})
const isEdit = computed(() => !!rowData.value)

const open = (data: Record<string, any>) => {
  rowData.value = data
  Object.assign(form, data)
  dialogVisible.value = true
}

const closeHandler = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    userName: null,
    password: null,
  })
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateUser' : 'addUser'
      const res = await apis?.[apiName]({
        id: rowData.value?.id,
        ...form,
      })
      if (res) {
        ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
        emits('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error(isEdit.value ? '修改失败' : '添加失败')
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
