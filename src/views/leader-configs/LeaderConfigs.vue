<template>
  <PageTitle title="团长管理" />

  <el-form ref="searchFormRef" class="form-box" :model="searchForm" label-width="120px">
    <el-form-item label="用户Id" prop="userId">
      <el-input v-model="searchForm.userId" placeholder="请输入用户id" />
    </el-form-item>
    <el-form-item label="手机号" prop="phoneNumber">
      <el-input v-model="searchForm.phoneNumber" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="searchForm.nickName" placeholder="请输入用户昵称" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getTableData">查 询</el-button>
      <el-button plain @click="reset">重 置</el-button>
    </el-form-item>
  </el-form>

  <!-- 批量操作 -->
  <div class="batch-buttons">
    <div class="batch-buttons__left"></div>

    <div class="batch-buttons__right">
      <el-button type="primary" @click="modifyLeaderHandler()">添加团长</el-button>
    </div>
  </div>

  <el-table :data="tableData" class="leader-table">
    <el-table-column label="用户id" prop="userId" width="100"></el-table-column>
    <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
    <el-table-column label="用户昵称" prop="nickName"></el-table-column>
    <el-table-column label="团员数量" prop="userCount"></el-table-column>
    <el-table-column label="团员订单数" prop="orderCount"></el-table-column>
    <el-table-column label="团销售金额" prop="salePrice"></el-table-column>
    <el-table-column label="团长收入金额" prop="commissionPrice"></el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <div>
          <el-button link type="primary">下载团员明细</el-button>
          <el-button link type="primary">暂停团长身份</el-button>
          <el-button link type="primary">删除团长</el-button>
          <el-button link type="primary" @click="viewCode(row)">查看二维码</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <AddLeaderDialog ref="addLeaderRef" @getTableData="getTableData" />

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

  <QrCode ref="qrCodeRef" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as apis from '@/api/services'
import { PageTitle, QrCode } from '@/components'
import { AddLeaderDialog } from './components'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const searchFormRef = ref()
const addLeaderRef = ref()
const searchForm = reactive({
  userId: null,
  phoneNumber: null,
  nickName: null,
})
const qrCodeRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getLeaderList({
      ...searchForm,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    tableData.value = rows
    totalCount.value = total
  } catch {
    tableData.value = []
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
 * @description: 添加团长
 */
const modifyLeaderHandler = (row = null) => {
  addLeaderRef.value?.open(row)
}

const reset = () => {
  searchFormRef.value?.resetFields()
  getTableData()
}

const viewCode = (row) => {
  qrCodeRef.value?.open(row?.qrCode)
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
