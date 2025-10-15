<!--
 * @Autor: jiangzupei
 * @Description: 优惠券列表
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-10-15 15:15:15
 * @FilePath: /orange-man/src/views/coupon/CouponList.vue
-->
<template>
  <div>
    <PageTitle title="优惠券列表" />

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button type="primary" @click="editCateHandler()">新增券</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" current-row-key="id" class="coupon-table">
      <el-table-column label="券id" prop="id" width="60"></el-table-column>
      <el-table-column label="优惠券名称" prop="name" min-width="100"></el-table-column>
      <el-table-column label="优惠券类型" prop="type" min-width="160">
        <template #default="{ row }">
          <div>{{ COUPON_NAME_MAP?.[row?.type as keyof typeof COUPON_NAME_MAP] }}</div>
          <div class="publish-type">
            发放方式：{{ PUBLISH_LIST.find((item) => item?.value === row?.publishType)?.label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="覆盖商品" min-width="200">
        <template #default="{ row }">
          <div>{{ row?.productIdList?.join('、') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="包邮运费上限" min-width="120">
        <template #default="{ row }">
          <span>{{ row?.waybillPriceLimit ? `${row?.waybillPriceLimit}元` : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专享券金额" min-width="125">
        <template #default="{ row }">
          <span>{{ row?.newPersonPrice ? `${row?.newPersonPrice}元` : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取用户数" min-width="100">
        <template #default="{ row }">
          {{ row?.receiveUserCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="覆盖用户数" prop="converUserCount" min-width="100"></el-table-column>
      <el-table-column label="生效时间段" width="200">
        <template #default="{ row }">
          <div>{{ formatDate(row?.startTime) }} 至 {{ formatDate(row?.endTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <div>
            {{ STATUS_NAME_MAP[row?.couponStatus as keyof typeof STATUS_NAME_MAP] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button
              v-if="[COUPON_STATUS.CLOSED, COUPON_STATUS.WAIT_PUB].includes(row?.couponStatus)"
              link
              type="primary"
              @click="openHandler(row)"
              >启用</el-button
            >
            <el-button v-if="row?.couponStatus === COUPON_STATUS.ACTIVE" link type="primary" @click="closeHandler(row)"
              >停用</el-button
            >
            <el-button
              v-if="[COUPON_STATUS.ACTIVE, COUPON_STATUS.WAIT_PUB].includes(row?.couponStatus)"
              link
              type="primary"
              @click="editCateHandler(row)"
              >修改</el-button
            >
            <el-button
              v-if="row?.publishType === PUBLISH_TYPE.LINK && row?.qrCode"
              link
              type="primary"
              @click="viewCode(row)"
              >查看二维码</el-button
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
  <AddCoupon ref="addCouponRef" @getTableData="getTableData" />
  <QrCode ref="qrCodeRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'
import { AddCoupon } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'
import { COUPON_NAME_MAP, STATUS_NAME_MAP, COUPON_STATUS, PUBLISH_TYPE, PUBLISH_LIST } from './constants'
import { formatDate } from '@/utils'
import { PageTitle, QrCode } from '@/components'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addCouponRef = ref()
const qrCodeRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getCouponList({
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

const editCateHandler = (row = null) => {
  addCouponRef.value?.open(row)
}

/**
 * @description: 停用
 */
const closeHandler = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认停用吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.closeCoupon({
      id: Number(row?.id),
    })
    if (res) {
      ElMessage.success('停用成功')
      getTableData()
    } else {
      ElMessage.error('停用失败')
    }
  } catch {}
}

const viewCode = (row) => {
  qrCodeRef.value?.open(row?.qrCode)
}

/**
 * @description: 启用
 */
const openHandler = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认启用吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.openCoupon({
      id: Number(row?.id),
    })
    if (res) {
      ElMessage.success('启用成功')
      getTableData()
    } else {
      ElMessage.error('启用失败')
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
