<template>
  <div class="login">
    <div class="login__container">
      <div class="login__header">
        <h2 class="login__title">系统登录</h2>
        <p class="login__subtitle">欢迎使用管理系统</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login__form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login__submit" :loading="loading" @click="handleLogin"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as apis from '@/api/services'
// 导入Element Plus图标
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 表单引用
const loginFormRef = ref()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 加载状态
const loading = ref(false)

// 表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      // 调用登录API并存储token
      try {
        const { authToken } = await apis.userLogin({
          pin: loginForm.username,
          password: loginForm.password,
        })

        // 将authToken存储到localStorage，设置过期时间为一周
        const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // 一周的毫秒数
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('tokenExpiration', expirationTime.toString())

        // 登录成功提示
        ElMessage.success('登录成功')

        // 跳转到首页或其他页面
        router.push('/')
      } catch (error) {
        ElMessage.error(`登录失败: ${error}`)
      } finally {
        loading.value = false
      }
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
