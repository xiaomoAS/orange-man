<template>
  <el-dialog v-model="dialogVisible" title="新增资源位" @close="closeHandler">
    <div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="isEdit" label="资源位ID" prop="name">
          <el-input v-model="form.id" placeholder="请输入资源位ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="资源位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资源位名称"></el-input>
        </el-form-item>
        <el-form-item label="资源位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择资源位类型">
            <el-option
              v-for="item in RESOURCE_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源位位置" prop="areaType">
          <el-select v-model="form.areaType" placeholder="请选择资源位位置">
            <el-option
              v-for="item in AREA_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
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
import { RESOURCE_TYPE_LIST, AREA_TYPE_LIST } from '../../constants'

const rules = {
  name: [{ required: true, message: '请输入资源位名称', trigger: 'change' }],
  type: [{ required: true, message: '请选择资源位类型', trigger: 'change' }],
  areaType: [{ required: true, message: '请选择资源位位置类型', trigger: 'change' }],
  url: [{ required: true, message: '请上传资源位文件', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive({
  id: undefined,
  name: null,
  type: null,
  areaType: null,
  url: null,
})
const isEdit = computed(() => rowData.value)

const open = (data = null) => {
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
      const apiName = isEdit.value ? 'updateResource' : 'addResource'
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
