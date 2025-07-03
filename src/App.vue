<!--
 * @Autor: jiangzupei
 * @Description: 
 * @Date: 2025-06-30 14:11:45
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-06-30 17:10:26
 * @FilePath: /orange-man/src/App.vue
-->
<script setup lang="ts">
// import { RouterView } from 'vue-router'
import MainMenu from './views/menu/MainMenu.vue'
</script>

<template>
  <div class="main-box">
    <div class="top-header">
      <h2>运营工作台</h2>
    </div>
    <div class="bottom-box">
      <MainMenu />
      <div class="main-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-box {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f1f2f5;
}

.top-header {
  padding: 8px 16px;
  font-weight: 600;
}

.bottom-box {
  width: 100%;
  display: flex;
  flex: 1;
}

.main-content {
  padding: 16px 16px 80px;
  flex: 1;
  margin-left: 16px;
  border-radius: 8px;
  background-color: #ffffff;
}
</style>
