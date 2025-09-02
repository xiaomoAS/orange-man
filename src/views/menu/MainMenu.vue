<!--
 * @Autor: jiangzupei
 * @Description: 菜单
 * @Date: 2025-06-30 14:57:13
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-22 15:22:37
 * @FilePath: /orange-man/src/views/menu/MainMenu.vue
-->
<template>
  <el-menu :default-active="currentRoute" router class="main-menu">
    <el-menu-item index="/ware">
      <span class="main-menu__title">商品</span>
    </el-menu-item>
    <el-menu-item index="/promotionsResource">
      <span class="main-menu__title">营销资源位</span>
    </el-menu-item>
    <el-menu-item index="/promotionsActivity">
      <span class="main-menu__title">营销活动场</span>
    </el-menu-item>
    <el-menu-item index="/orders">
      <span class="main-menu__title">订单</span>
    </el-menu-item>
    <el-menu-item index="/couponList">
      <span class="main-menu__title">优惠券</span>
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
