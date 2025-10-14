<!--
 * @Autor: jiangzupei
 * @Description: 菜单
 * @Date: 2025-06-30 14:57:13
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-10-14 15:31:49
 * @FilePath: /orange-man/src/views/menu/MainMenu.vue
-->
<template>
  <div class="menu-container">
    <el-menu :default-active="currentRoute" router class="main-menu" :collapse="isCollapsed">
      <div class="menu-header">
        <span v-if="!isCollapsed" class="menu-header-title">功能导航</span>
        <el-icon class="collapse-icon" @click="toggleCollapse"> <Expand v-if="isCollapsed" /><Fold v-else /> </el-icon>
      </div>

      <el-menu-item index="/ware">
        <el-icon><Goods /></el-icon>
        <template #title>
          <span class="main-menu__title">商品</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/promotionsResource">
        <el-icon><Picture /></el-icon>
        <template #title>
          <span class="main-menu__title">营销资源位</span>
        </template>
      </el-menu-item>

      <!-- <el-menu-item index="/promotionsActivity">
        <el-icon><Calendar /></el-icon>
        <template #title>
          <span class="main-menu__title">营销活动场</span>
        </template>
      </el-menu-item> -->

      <el-menu-item index="/orders">
        <el-icon><List /></el-icon>
        <template #title>
          <span class="main-menu__title">订单</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/couponList">
        <el-icon><Ticket /></el-icon>
        <template #title>
          <span class="main-menu__title">优惠券</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/userList">
        <el-icon><User /></el-icon>
        <template #title>
          <span class="main-menu__title">用户权限列表</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Goods, Picture, Calendar, List, Ticket, Expand, Fold, User } from '@element-plus/icons-vue'

const route = useRoute()
const isCollapsed = ref(false)

// 根据当前路由动态设置菜单高亮
const currentRoute = computed(() => {
  return route.path
})

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
