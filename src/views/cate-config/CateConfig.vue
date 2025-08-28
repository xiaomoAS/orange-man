<!--
 * @Autor: jiangzupei
 * @Description: 类目设置
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-28 17:40:28
 * @FilePath: /orange-man/src/views/cate-config/CateConfig.vue
-->
<template>
  <div>
    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button type="primary" link @click="editCateHandler()">新增类目</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" current-row-key="id" class="cate-table">
      <el-table-column label="类目名称" prop="name"></el-table-column>
      <el-table-column label="类目类型" prop="typeDesc"></el-table-column>
      <el-table-column label="类目状态" prop="status">
        <template #default="{ row }">
          {{ CATE_STATUS_NAME?.[row?.status as keyof typeof CATE_STATUS_NAME] || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button link type="primary" @click="cateStatusHandler(row)">{{
              row?.status === CATE_STATUS.SHOW ? '下线' : '上线'
            }}</el-button>
            <el-button link type="primary" @click="editCateHandler(row)">编辑</el-button>
            <el-button link type="primary" @click="deleteHandler(row)">删除</el-button>
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
  <AddCate ref="addCateRef" @getTableData="getTableData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'
import { AddCate } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CATE_STATUS_NAME, CATE_STATUS } from './constants'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addCateRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getCateList({
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
 * @description: 类目上线状态改变
 */
const cateStatusHandler = async (row: Record<string, any>) => {
  try {
    const operName = row?.status === CATE_STATUS.SHOW ? '下线' : '上线'
    await ElMessageBox.confirm(`确认${operName}类目吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    const apiName = row?.status === CATE_STATUS.SHOW ? 'cateOffline' : 'cateOnline'
    const res = await apis?.[apiName]({
      id: Number(row?.id),
    })
    if (res) {
      ElMessage.success(`${operName}成功`)
    } else {
      ElMessage.error(`${operName}失败`)
    }
  } catch (error) {
    console.log(error)
  }
}

const editCateHandler = (row = null) => {
  addCateRef.value?.open(row)
}

/**
 * @description: 删除
 */
const deleteHandler = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认删除吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.deleteCate({
      id: Number(row?.id),
    })
    if (res) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  } catch {}
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
