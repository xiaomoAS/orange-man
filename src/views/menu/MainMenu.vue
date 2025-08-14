<!--
 * @Autor: jiangzupei
 * @Description: 菜单
 * @Date: 2025-06-30 14:57:13
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-14 10:51:32
 * @FilePath: /orange-man/src/views/menu/MainMenu.vue
-->
<template>
  <el-menu :default-active="currentRoute" router class="main-menue">
    <el-menu-item index="/ware">
      <span>商品</span>
    </el-menu-item>
    <el-menu-item index="/promotionsResource">
      <span>营销资源位</span>
    </el-menu-item>
    <el-menu-item index="/promotionsActivity">
      <span>营销活动场</span>
    </el-menu-item>
    <el-menu-item index="/orders">
      <span>履约</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 根据当前路由动态设置菜单高亮
const currentRoute = computed(() => {
  return route.path
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
