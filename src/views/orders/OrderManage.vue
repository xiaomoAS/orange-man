<!--
 * @Autor: jiangzupei
 * @Description: 订单列表
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-10-24 10:28:34
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
        <el-select v-model="searchForm.orderStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in ORDER_STATUS_LIST" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收货人姓名" prop="receiverName">
        <el-input v-model="searchForm.receiverName" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="收货人手机号" prop="receiverMobile">
        <el-input v-model="searchForm.receiverMobile" placeholder="请输入收货人手机号" />
      </el-form-item>
      <el-form-item label="商品id" prop="productId">
        <el-input v-model="searchForm.productId" placeholder="请输入商品id" />
      </el-form-item>
      <el-form-item label="运单号" prop="waybillCode">
        <el-input v-model="searchForm.waybillCode" placeholder="请输入运单号" />
      </el-form-item>
      <el-form-item label="支付时间" prop="payTime" class="double-span-item">
        <el-date-picker
          v-model="searchForm.payTime"
          placeholder="请选择时间"
          type="datetimerange"
          start-placeholder="支付开始时间"
          end-placeholder="支付结束时间"
          value-format="x"
          :default-time="defaultTime"
        />
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
        <el-button>批量出库</el-button> -->
      </div>

      <div class="batch-buttons__right"></div>
    </div>

    <!-- 表格 -->
    <el-table class="order-table" :data="tableData" current-row-key="orderId" border>
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="订单信息" width="260">
        <template #default="{ row }">
          <div>订单编号：{{ row?.id }}</div>
          <div v-if="row?.waybillCode">运单号：{{ row?.waybillCode }}</div>
          <div>下单时间：{{ formatDate(row?.createdTime) }}</div>
          <div v-if="row?.payTime">支付时间：{{ formatDate(row?.payTime) }}</div>
          <div v-if="row?.estimatedDeliveryTime">预计送达时间：{{ formatDate(row?.estimatedDeliveryTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="400">
        <template #default="{ row }">
          <div v-for="item in row?.productList" class="product-info" :key="item?.productId">
            <img class="product-info__img" :src="item?.imgUrl" alt="商品图" />
            <div class="product-info__content-box">
              <div>
                <AdvCustomTooltip :showLine="2" :content="item.productName">
                  <span class="product-info__title">{{ item.productName }}</span>
                </AdvCustomTooltip>
                <span>商品编码：{{ item.productId }}</span>
              </div>
              <div class="product-info__price-box">
                <div>¥{{ item?.price }}</div>
                <div>x{{ item?.buyCounts }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应收" width="150">
        <template #default="{ row }">
          <div>原价：¥{{ row?.totalAmount || 0 }}</div>
          <div v-if="row?.postAmount">运费：¥{{ row?.postAmount || 0 }}</div>
          <div v-if="row?.realPayAmount">
            {{ row?.orderStatus === ORDER_STATUS.WAIT_PAY ? '应付' : '实付' }}金额：¥{{ row?.realPayAmount || 0 }}
          </div>
          <div v-if="row?.couponIds">覆盖优惠券Id：{{ row?.couponIds }}</div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="180">
        <template #default="{ row }">
          <div>姓名：{{ row?.receiverName }}</div>
          <div>手机号：{{ row?.receiverMobile }}</div>
          <div>详细地址：{{ row?.receiverAddress }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="buyerRemark" label="买家留言"></el-table-column> -->
      <el-table-column prop="orderStatus" label="订单状态">
        <template #default="{ row }">
          <span>{{ ORDER_STATUS_LIST?.find((item) => item.value === row?.orderStatus)?.label || '-' }}</span>
          <div v-if="row?.waybillCompanyName" class="waybill-company">{{ row?.waybillCompanyName }}</div>
          <div v-if="row?.waybillCode">运单号：{{ row?.waybillCode }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button
              v-if="row?.orderStatus === ORDER_STATUS.WAIT_OUT"
              link
              type="primary"
              @click="uploadWaybillNum(row)"
              >出库</el-button
            >
            <el-button
              v-if="row?.orderStatus === ORDER_STATUS.HAS_OUT && row?.waybillUrl"
              link
              type="primary"
              @click="printExpress(row)"
              >重新打印面单</el-button
            >
            <el-button v-if="row?.orderStatus === ORDER_STATUS.HAS_OUT" link type="primary" @click="confirmReceive(row)"
              >确认收货</el-button
            >
            <el-button
              v-if="[ORDER_STATUS.WAIT_OUT, ORDER_STATUS.HAS_OUT, ORDER_STATUS.COMPLETED].includes(row?.orderStatus)"
              link
              type="primary"
              @click="printOutOrder(row)"
              >打印出库单</el-button
            >
            <el-button v-if="row?.orderStatus === ORDER_STATUS.WAIT_PAY" link type="primary" @click="cancelOrder(row)"
              >取消订单</el-button
            >
            <el-button
              v-if="[ORDER_STATUS.WAIT_OUT, ORDER_STATUS.HAS_OUT, ORDER_STATUS.COMPLETED].includes(row?.orderStatus)"
              link
              type="primary"
              @click="refundOrder(row)"
              >取消并退款</el-button
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

  <UploadWaybill ref="uploadWayBillRef" @getTableData="getTableData" />
  <PrintWaybill ref="printWaybillRef" @getTableData="getTableData" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { TAB_ID, ORDER_STATUS_LIST, ORDER_STATUS } from './constants.ts'
import * as apis from '@/api/services'
import { AdvCustomTooltip, PageTitle } from '@/components'
import { formatDate } from '@/utils/index.ts'
import { UploadWaybill, PrintWaybill } from './components'
import { ElMessage, ElMessageBox } from 'element-plus'

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
const activeTab = ref(TAB_ID.ALL)
const searchForm = reactive({
  orderId: null,
  orderStatus: null,
  receiverName: null,
  receiverMobile: null,
  productId: null,
  waybillCode: null,
  payTime: [],
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
      createTime: undefined,
      payStartTime: searchForm?.payTime?.length > 0 ? searchForm?.payTime[0] : null,
      payEndTime: searchForm?.payTime?.length > 1 ? searchForm?.payTime[1] : null,
      createStartTime: searchForm?.createTime?.length > 0 ? searchForm?.createTime[0] : null,
      createEndTime: searchForm?.createTime?.length > 1 ? searchForm?.createTime[1] : null,
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
  window?.open(row?.waybillUrl)
}

/**
 * @description: 打印出库单
 */
const printOutOrder = async (row: Record<string, any>) => {
  try {
    const { waybillUrl } = await apis.printOutOrder({ orderId: row?.id })
    if (waybillUrl) {
      window.open(waybillUrl)
    }
  } catch {}
}

/**
 * @description: 确认收货
 */
const confirmReceive = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认收货吗`, '提示', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.receiveOrder({ orderId: Number(row?.id) })
    if (res) {
      ElMessage.success('确认收货成功')
      getTableData()
    } else {
      ElMessage.error('确认收货失败')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description: 出库
 * @param {Object} row 行信息
 */
const uploadWaybillNum = (row: Record<string, any>) => {
  uploadWayBillRef.value?.open(row)
}

/**
 * @description: 取消订单
 */
const cancelOrder = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认取消订单吗`, '提示', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.cancelOrder({ orderId: Number(row?.id) })
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

/**
 * @description: 退款订单
 */
const refundOrder = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(
      `注意：此操作仅是退款给消费者，货物履约等问题需要运营人员自己后续处理！（微信退款有延迟，请等待一段时间查询状态）`,
      '确认退款订单吗',
      {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning',
      },
    ).then(() => true)
    const res = await apis.refundOrder({ orderId: Number(row?.id) })
    if (res) {
      ElMessage.success('退款成功')
      getTableData()
    } else {
      ElMessage.error('退款失败')
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
