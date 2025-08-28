<!--
 * @Autor: jiangzupei
 * @Description: 类目设置
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-28 17:49:02
 * @FilePath: /orange-man/src/views/coupon/CouponList.vue
-->
<template>
  <div>
    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left"></div>

      <div class="batch-buttons__right">
        <el-button type="primary" link @click="editCateHandler()">新增券</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" current-row-key="id" class="coupon-table">
      <el-table-column label="优惠券名称" prop="name"></el-table-column>
      <el-table-column label="优惠券类型" prop="type">
        <template #default="{ row }">
          <div>{{ COUPON_NAME_MAP?.[row?.type as keyof typeof COUPON_NAME_MAP] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="覆盖商品">
        <template #default="{ row }">
          <div>{{ row?.productIdList?.join('、') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="包邮运费上限" prop="waybillPriceLimit"></el-table-column>
      <el-table-column label="领取用户数" prop="receiveUserCount"></el-table-column>
      <el-table-column label="覆盖用户数" prop="converUserCount"></el-table-column>
      <el-table-column label="生效时间段">
        <template #default="{ row }">
          <!-- TODO 字段 -->
          <div>{{ row?.effectiveTimeInterval }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <div>
            {{ STATUS_NAME_MAP[row?.status as keyof typeof STATUS_NAME_MAP] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button link type="primary" @click="closeHandler(row)">停用</el-button>
            <el-button link type="primary" @click="editCateHandler(row)">修改</el-button>
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
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as apis from '@/api/services'
import { AddCoupon } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'
import { COUPON_NAME_MAP, STATUS_NAME_MAP } from './constants'
// import { formatDate } from '@/utils'

const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addCouponRef = ref()

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
    } else {
      ElMessage.error('停用失败')
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
