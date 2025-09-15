<!--
 * @Autor: jiangzupei
 * @Description: 订单列表
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-15 14:20:04
 * @FilePath: /orange-man/src/views/orders/OrderManage.vue
-->
<template>
  <div>
    <PageTitle title="订单列表" />

    <!-- 导航栏 -->
    <div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部订单" :name="TAB_ID.ALL"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 筛选条件 -->
    <el-form ref="orderFormRef" class="form-box" :model="searchForm" label-width="120px">
      <el-form-item label="订单号" prop="orderId">
        <el-input v-model="searchForm.orderId" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="searchForm.orderStatus" placeholder="请选择状态">
          <el-option v-for="item in ORDER_STATUS_LIST" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="searchForm.telephone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="下单时间" prop="createTime" class="double-span-item">
        <el-date-picker
          v-model="searchForm.createTime"
          placeholder="请选择时间"
          type="datetimerange"
          start-placeholder="下单开始时间"
          end-placeholder="下单结束时间"
          value-format="x"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查 询</el-button>
        <el-button plain @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left">
        <!-- <el-button>批量打印</el-button>
        <el-button>批量上传运单号</el-button> -->
      </div>

      <div class="batch-buttons__right"></div>
    </div>

    <!-- 表格 -->
    <el-table class="order-table" :data="tableData" current-row-key="orderId">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="订单信息" width="260">
        <template #default="{ row }">
          <div>订单编号：{{ row?.orderId }}</div>
          <div v-if="row?.waybillNumber">运单号：{{ row?.waybillNumber }}</div>
          <div>下单时间：{{ formatDate(row?.orderCreateTime) }}</div>
          <div>预计送达时间：{{ formatDate(row?.deliverTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="400">
        <template #default="{ row }">
          <div v-for="item in row?.itemInfoList" class="product-info" :key="item?.id">
            <img class="product-info__img" :src="item?.imgUrl" alt="商品图" />
            <div class="product-info__content-box">
              <div>
                <AdvCustomTooltip :showLine="2" :content="item.name">
                  <span class="product-info__title">{{ item.name }}</span>
                </AdvCustomTooltip>
                <span>商品编码：{{ item.productId }}</span>
              </div>
              <div class="product-info__price-box">
                <div>¥{{ item?.price }}</div>
                <div>x{{ item?.count }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应收" width="150">
        <template #default="{ row }">
          <div>实付金额：¥{{ row?.realPayPrice || 0 }}</div>
          <div>优惠金额：¥{{ row?.couponPrice || 0 }}</div>
          <div>运费：¥{{ row?.carryPrice || 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="150">
        <template #default="{ row }">
          <div>{{ row?.addressInfo?.name }}</div>
          <div>{{ row?.addressInfo?.telephone }}</div>
          <div>{{ row?.addressInfo?.detail }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyerRemark" label="买家留言"></el-table-column>
      <el-table-column prop="orderStatusDesc" label="订单状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button link type="primary" @click="printExpress(row)">打印面单</el-button>
            <el-button link type="primary" @click="uploadWaybillNum(row)">上传运单号</el-button>
            <el-button link type="primary" @click="cancelOrder(row)">取消订单</el-button>
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

  <UploadWaybill ref="uploadWayBillRef" @getTableData="getTableData" />
  <PrintWaybill ref="printWaybillRef" @getTableData="getTableData" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { TAB_ID, ORDER_STATUS_LIST } from './constants.ts'
import * as apis from '@/api/services'
import { AdvCustomTooltip, PageTitle } from '@/components'
import { formatDate } from '@/utils/index.ts'
import { UploadWaybill, PrintWaybill } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
const activeTab = ref(TAB_ID.ALL)
const searchForm = reactive({
  orderId: undefined,
  orderStatus: undefined,
  username: undefined,
  telephone: undefined,
  createTime: [],
})
const tableData = ref([])
const orderFormRef = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const uploadWayBillRef = ref()
const printWaybillRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getOrderList({
      ...searchForm,
      startCreateTime: searchForm?.createTime?.length > 0 ? searchForm?.createTime[0] : undefined,
      endCreateTime: searchForm?.createTime?.length > 1 ? searchForm?.createTime[1] : undefined,
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
 * @description: 打印面单
 */
const printExpress = (row: Record<string, any>) => {
  printWaybillRef.value?.open(row)
}

/**
 * @description: 上传运单号
 * @param {Object} row 行信息
 */
const uploadWaybillNum = (row: Record<string, any>) => {
  uploadWayBillRef.value?.open(row)
}

const cancelOrder = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认取消订单吗`, '提示', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.cancelOrder({ orderId: Number(row?.orderId) })
    if (res) {
      ElMessage.success('取消成功')
      getTableData()
    } else {
      ElMessage.error('取消失败')
    }
  } catch (error) {
    console.log(error)
  }
}

const reset = () => {
  orderFormRef.value?.resetFields()
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
