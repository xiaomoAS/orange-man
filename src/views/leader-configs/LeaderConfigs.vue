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
    <el-form-item label="认证时间" prop="createTime">
      <el-date-picker
        v-model="searchForm.createTime"
        placeholder="请选择时间"
        type="datetimerange"
        start-placeholder="认证开始时间"
        end-placeholder="认证结束时间"
        value-format="x"
        :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
      />
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
    <el-table-column label="认证时间" prop="createdTime">
      <template #default="{ row }">
        <span>{{ formatDate(row?.createdTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="认证状态" prop="leaderStatus">
      <template #default="{ row }">
        <span>{{ LEADER_STATUS_LIST?.find((item) => item?.value === row?.leaderStatus)?.label }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <div class="table-buttons">
          <el-button link type="primary">下载团员明细</el-button>
          <el-button v-if="row?.leaderStatus === LEADER_STATUS.NORMAL" link type="primary" @click="pauseLeader(row)"
            >暂停团长身份</el-button
          >
          <el-button link type="primary" @click="deleteLeader(row)">删除团长</el-button>
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
import { formatDate } from '@/utils/index.ts'
import { LEADER_STATUS, LEADER_STATUS_LIST } from './constants'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  createTime: [],
})
const qrCodeRef = ref()

/**
 * @description: 暂停团长
 */
const pauseLeader = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认暂停团长吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    await apis?.pauseLeader({
      id: row?.id,
    })
    ElMessage.success('暂停成功')
    getTableData()
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description: 暂停团长
 */
const deleteLeader = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认删除团长吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    await apis?.deleteLeader({
      id: row?.id,
    })
    ElMessage.success('删除成功')
    getTableData()
  } catch (error) {
    console.log(error)
  }
}

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getLeaderList({
      ...searchForm,
      createdStartTime: searchForm?.createTime?.length > 0 ? searchForm?.createTime[0] : null,
      createdEndTime: searchForm?.createTime?.length > 1 ? searchForm?.createTime[1] : null,
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
