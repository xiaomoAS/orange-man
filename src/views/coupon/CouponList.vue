<!--
 * @Autor: jiangzupei
 * @Description: 优惠券列表
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-11-10 15:32:22
 * @FilePath: /orange-man/src/views/coupon/CouponList.vue
-->
<template>
  <div>
    <PageTitle title="优惠券列表" />

    <el-form ref="couponFormRef" class="form-box" :model="searchForm" label-width="120px">
      <el-form-item label="优惠券ID" prop="couponIdList">
        <el-input v-model="searchForm.couponIdList" placeholder="请输入优惠券id，英文逗号分隔" />
      </el-form-item>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input v-model="searchForm.couponName" placeholder="请输入优惠券名称" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="couponType">
        <el-select v-model="searchForm.couponType" placeholder="请选择优惠券类型" clearable>
          <el-option v-for="item in COUPON_LIST" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券状态" prop="couponStatus">
        <el-select v-model="searchForm.couponStatus" placeholder="请选择优惠券状态" clearable>
          <el-option v-for="item in COUPON_STATUS_LIST" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放类型" prop="publishType">
        <el-select v-model="searchForm.publishType" placeholder="请选择发放类型" clearable>
          <el-option v-for="item in ALL_PUBLISH_LIST" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
            发放方式：{{ ALL_PUBLISH_LIST.find((item) => item?.value === row?.publishType)?.label }}
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
      <el-table-column label="覆盖用户数（总库存）" prop="converUserCount" min-width="100"></el-table-column>
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
import { ref, onMounted, reactive } from 'vue'
import * as apis from '@/api/services'
import { AddCoupon } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  COUPON_NAME_MAP,
  STATUS_NAME_MAP,
  COUPON_STATUS,
  PUBLISH_TYPE,
  ALL_PUBLISH_LIST,
  COUPON_LIST,
  COUPON_STATUS_LIST,
} from './constants'
import { formatDate } from '@/utils'
import { PageTitle, QrCode } from '@/components'

const searchForm = reactive<Record<string, any>>({
  couponIdList: null,
  couponName: null,
  couponType: null,
  couponStatus: null,
  publishType: null,
})
const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addCouponRef = ref()
const qrCodeRef = ref()
const couponFormRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getCouponList({
      ...searchForm,
      couponIdList: searchForm?.couponIdList ? searchForm?.couponIdList?.split(',')?.map((item) => Number(item)) : null,
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

const reset = () => {
  couponFormRef.value?.resetFields()
  getTableData()
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
