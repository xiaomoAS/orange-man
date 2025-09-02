<!--
 * @Autor: jiangzupei
 * @Description:
 * @Date: 2025-06-30 14:11:45
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-02 17:21:43
 * @FilePath: /orange-man/src/App.vue
-->
<script setup lang="ts">
// import { RouterView } from 'vue-router'
import MainMenu from './views/menu/MainMenu.vue'
</script>

<template>
  <div class="main-box">
    <div class="top-header">
      <div class="header-content">
        <div class="logo-area">
          <span class="logo-icon">🍊</span>
          <h2>运营工作台</h2>
        </div>
        <div class="header-actions">
          <!-- 可以在这里添加用户头像、通知图标等 -->
        </div>
      </div>
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
  background-color: #f5f7fa;
  color: #333;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
}

.top-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;

  .header-content {
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1800px;
    margin: 0 auto;
    width: 100%;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      font-size: 24px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(90deg, #ff6a00, #ee0979);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.5px;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.bottom-box {
  width: 100%;
  display: flex;
  flex: 1;
  max-width: 1800px;
  margin: 0 auto;
  padding: 16px 12px;
  box-sizing: border-box;
}

.main-content {
  padding: 24px;
  flex: 1;
  margin-left: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: auto;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 768px) {
  .bottom-box {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>
