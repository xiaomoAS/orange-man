<!--
 * @Autor: jiangzupei
 * @Description: 营销资源位
 * @Date: 2025-07-03 15:44:21
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-07-03 16:10:00
 * @FilePath: /orange-man/src/views/promotionsActivity/PromotionsActivity.vue
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
    <el-table-column prop="activityId" label="活动场id"></el-table-column>
    <el-table-column prop="activityName" label="活动名称"></el-table-column>
    <el-table-column prop="channel" label="活动投放渠道"></el-table-column>
    <el-table-column prop="startTime" label="活动开始时间"></el-table-column>
    <el-table-column prop="endTime" label="活动结束时间"></el-table-column>
    <el-table-column prop="status" label="活动状态"></el-table-column>
    <el-table-column label="操作">
      <div class="operation-box">
        <el-button size="mini" type="text">编辑</el-button>
        <el-button size="mini" type="text">关闭</el-button>
        <el-button size="mini" type="text">开启</el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const tableData = [
  {
    activityId: 1123451123,
    activityName: '活动1',
    channel: '渠道',
    startTime: '06-29',
    endTime: '06-30',
    status: '成功',
  },
]
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
