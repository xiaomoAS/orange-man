<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改资源报告"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form ref="reportFormRef" :model="reportForm" label-width="120px" :rules="rules">
      <el-form-item label="商品标签" prop="tags">
        <el-input v-model="reportForm.tags" placeholder="请输入商品标签，用英文,分隔"></el-input>
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
import { reactive, ref } from 'vue'

const dialogVisible = ref<boolean>(false)
const reportFormRef = ref()
const reportForm = reactive<Record<string, any>>({})
const rules = {}

const submitHandler = () => {}
const handleClose = () => {}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
