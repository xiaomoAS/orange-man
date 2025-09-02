<!--
 * @Autor: jiangzupei
 * @Description: 营销活动场
 * @Date: 2025-07-03 15:44:21
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-02 17:16:58
 * @FilePath: /orange-man/src/views/promotions-activity/PromotionsActivity.vue
-->
<template>
  <div>
    <PageTitle title="营销活动场" />

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button type="primary" @click="editActivity()">新增活动场</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" class="activity-table">
      <el-table-column prop="id" label="活动场id"></el-table-column>
      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column prop="wayType" label="活动投放渠道">
        <template #default="{ row }">
          <div>{{ WAY_TYPE_MAP?.[row?.wayType as keyof typeof WAY_TYPE_MAP] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="活动开始时间">
        <template #default="{ row }">
          <div>{{ formatDate(row?.startTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动结束时间">
        <template #default="{ row }">
          <div>{{ formatDate(row?.endTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="活动状态">
        <template #default="{ row }">
          <div>{{ ACTIVITY_STATUS_MAP?.[row?.status as keyof typeof ACTIVITY_STATUS_MAP] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button type="primary" link @click="editActivity(row)">编辑</el-button>
            <el-button v-if="row?.statys === ACTIVITY_STATUS.ACTIVE" type="primary" link @click="statusChange(row)"
              >关闭</el-button
            >
            <el-button v-if="row?.statys === ACTIVITY_STATUS.CLOSED" type="primary" link @click="statusChange(row)"
              >开启</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-box">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <AddActivity ref="addActivityRef" @getTableData="getTableData" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'
import { WAY_TYPE_MAP, ACTIVITY_STATUS_MAP, ACTIVITY_STATUS } from './constants'
import { formatDate } from '@/utils/index.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AddActivity } from './components'
import { PageTitle } from '@/components'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addActivityRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getActivityList({
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    tableData.value = rows
    totalCount.value = total
  } catch {
    tableData.value = []
    totalCount.value = 0
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTableData()
}

/**
 * @description: 开启状态改变
 */
const statusChange = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认${row?.status === ACTIVITY_STATUS.CLOSED ? '开启' : '关闭'}活动吗`, '提示', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
    }).then(() => true)
    const apiName = row?.status === ACTIVITY_STATUS.CLOSED ? 'openActivity' : 'closeActivity'
    const res = await apis?.[apiName]({ id: Number(row?.id) })
    if (res) {
      ElMessage.success('取消成功')
      getTableData()
    } else {
      ElMessage.error('取消失败')
    }
  } catch {}
}

/**
 * @description: 新增/编辑活动
 */
const editActivity = (row = null) => {
  addActivityRef.value?.open(row)
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
