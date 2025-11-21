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
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户Id"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="团长等级" prop="level">
          <el-select v-model="form.level" placeholder="团长等级" clearable>
            <el-option v-for="item in LEADER_LEVEL_LIST" :key="item?.value" :label="item?.label" :value="item?.value" />
          </el-select>
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
import { LEADER_LEVEL_LIST } from '@/views/leader-configs/constants'

const rules = {
  userId: [{ required: true, message: '请输入用户Id', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  level: [{ required: true, message: '请选择团长等级', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive<Record<string, any>>({
  userId: null,
  phoneNumber: null,
  level: null,
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
    userId: null,
    phoneNumber: null,
    level: null,
  })
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateLeader' : 'addLeader'
      const res = await apis?.[apiName]({
        id: rowData.value?.id,
        userId: form?.userId,
        phoneNumber: form?.phoneNumber,
        level: form?.level,
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
