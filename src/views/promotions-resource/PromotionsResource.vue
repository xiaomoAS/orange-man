<!--
 * @Autor: jiangzupei
 * @Description: 营销资源位
 * @Date: 2025-07-03 15:44:21
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-12 10:42:40
 * @FilePath: /orange-man/src/views/promotions-resource/PromotionsResource.vue
-->
<template>
  <div>
    <PageTitle title="营销资源位" />

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button type="primary" @click="editResourceHandler()">新增资源位</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" class="promotion-table">
      <el-table-column prop="id" label="资源位编号"></el-table-column>
      <el-table-column prop="name" label="资源位名称"></el-table-column>
      <el-table-column prop="type" label="展示类型">
        <template #default="{ row }">
          <div>{{ RESOURCE_NAME_MAP?.[row.type as keyof typeof RESOURCE_NAME_MAP] || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="areaType" label="位置类型">
        <template #default="{ row }">
          <div>{{ AREA_NAME_MAP?.[row.areaType as keyof typeof AREA_NAME_MAP] || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button type="primary" link @click="editResourceHandler(row)">编辑</el-button>
            <el-button type="primary" link @click="deleteHandler(row)">删除</el-button>
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
  <AddResource ref="addResourceRef" @getTableData="getTableData" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'
import { RESOURCE_NAME_MAP, AREA_NAME_MAP } from './constants'
import { AddResource } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PageTitle } from '@/components'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addResourceRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getResourceList({
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
 * @description: 添加/编辑 资源位
 */
const editResourceHandler = (row = null) => {
  addResourceRef.value?.open(row)
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
    const res = await apis.deleteResource({
      id: Number(row?.id),
    })
    if (res) {
      ElMessage.success('删除成功')
      getTableData()
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
