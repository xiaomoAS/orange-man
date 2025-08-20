<!--
 * @Autor: jiangzupei
 * @Description: 营销资源位
 * @Date: 2025-07-03 15:44:21
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-07-03 15:54:40
 * @FilePath: /orange-man/src/views/promotionsResource/PromotionsResource.vue
-->
<template>
  <!-- 批量操作 -->
  <div class="batch-buttons">
    <div class="batch-buttons__left"></div>

    <div class="batch-buttons__right">
      <el-button type="primary" link>新增资源位</el-button>
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="tableData">
    <el-table-column prop="resourceId" label="资源位编号"></el-table-column>
    <el-table-column prop="resourceName" label="资源位名称"></el-table-column>
    <el-table-column prop="type" label="展示类型"></el-table-column>
    <el-table-column prop="size" label="尺寸"></el-table-column>
    <el-table-column label="操作">
      <div class="operation-box">
        <el-button size="mini" type="text">编辑</el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const tableData = [
  {
    resourceId: 1123451123,
    resourceName: '资源位1',
    type: 'xxxx',
    size: '12M',
  },
]
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
