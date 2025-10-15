<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看二维码"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div class="code-box">
      <img class="qr-code" :src="codeUrl" alt="二维码" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="downLoadCode">下载二维码</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const codeUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const open = (url) => {
  codeUrl.value = url
  dialogVisible.value = true
}

const closeHandler = () => {
  codeUrl.value = ''
}

const downLoadCode = () => {
  window.open(codeUrl.value)
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
