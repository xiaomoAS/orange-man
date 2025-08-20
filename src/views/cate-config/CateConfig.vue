<!--
 * @Autor: jiangzupei
 * @Description: 类目设置
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-20 15:34:39
 * @FilePath: /orange-man/src/views/cateConfig/CateConfig.vue
-->
<template>
  <div>
    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button plain>新增类目</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" current-row-key="id" class="cate-table">
      <el-table-column label="类目名称" prop="name"></el-table-column>
      <el-table-column label="类目类型" prop="typeDesc"></el-table-column>
      <!-- TODO：字段 -->
      <el-table-column label="类目状态" prop="typeStatus"></el-table-column>
      <el-table-column label="操作">
        <template>
          <div class="operation-box">
            <el-button link type="primary">上线/下线</el-button>
            <el-button link type="primary">编辑</el-button>
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
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getCatelList({
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

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
