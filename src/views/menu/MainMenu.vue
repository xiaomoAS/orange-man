<!--
 * @Autor: jiangzupei
 * @Description: 菜单
 * @Date: 2025-06-30 14:57:13
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-07-03 15:42:31
 * @FilePath: /orange-man/src/views/menu/MainMenue.vue
-->
<template>
  <el-menu default-active="/ware" router class="main-menue">
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

<script setup lang="ts"></script>

<style scoped lang="scss">
@use './index.scss';
</style>
