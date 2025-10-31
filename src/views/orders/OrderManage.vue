<!--
 * @Autor: jiangzupei
 * @Description: 订单列表
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: xiaomoAS jiangzupei@gmail.com
 * @LastEditTime: 2025-10-31 16:05:03
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
        <span class="select-text"
          >已选 <span class="select-text__num">{{ selectList?.length }}</span> 条</span
        >
        <el-button @click="batchPrintOut">批量打印出库单</el-button>
        <el-button @click="batchOut">批量出库</el-button>
        <el-button @click="batchExport">订单导出</el-button>
      </div>

      <div class="batch-buttons__right"></div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="tableLoading"
      class="order-table"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单信息" width="260">
        <template #default="{ row }">
          <div class="table-item"><span class="table-item__label">订单编号：</span>{{ row?.id }}</div>
          <div v-if="row?.waybillCode" class="table-item">
            <span class="table-item__label">运单号：</span>{{ row?.waybillCode }}
          </div>
          <div class="table-item">
            <span class="table-item__label">下单时间：</span>{{ formatDate(row?.createdTime) }}
          </div>
          <div v-if="row?.payTime" class="table-item">
            <span class="table-item__label">支付时间：</span>{{ formatDate(row?.payTime) }}
          </div>
          <div v-if="row?.estimatedDeliveryTime" class="table-item">
            <span class="table-item__label">预计送达时间：</span>{{ formatDate(row?.estimatedDeliveryTime) }}
          </div>
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
                <span class="product-info__text">商品编码：{{ item.productId }}</span>
              </div>
              <div class="product-info__price-box">
                <div>¥{{ item?.price }}</div>
                <div>x{{ item?.buyCounts }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应收" width="160">
        <template #default="{ row }">
          <div class="table-item">
            <span class="table-item__label">原价：</span><span class="price-text">¥{{ row?.totalAmount || 0 }}</span>
          </div>
          <div v-if="row?.postAmount" class="table-item">
            <span class="table-item__label">运费：</span><span class="price-text">¥{{ row?.postAmount || 0 }}</span>
          </div>
          <div v-if="row?.realPayAmount" class="table-item">
            <span class="table-item__label"
              >{{ row?.orderStatus === ORDER_STATUS.WAIT_PAY ? '应付' : '实付' }}金额：</span
            >
            <span class="price-text">¥{{ row?.realPayAmount || 0 }}</span>
          </div>
          <div v-if="row?.payMethod" class="table-item">
            <span class="table-item__label">支付方式：</span
            >{{ PAY_METHOD_LIST.find((item) => item.value === row?.payMethod)?.label }}
          </div>
          <div v-if="row?.couponIds" class="table-item">
            <span class="table-item__label">覆盖优惠券Id：</span>{{ row?.couponIds }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="180">
        <template #default="{ row }">
          <div class="table-item"><span class="table-item__label">姓名：</span>{{ row?.receiverName }}</div>
          <div class="table-item"><span class="table-item__label">手机号：</span>{{ row?.receiverMobile }}</div>
          <div class="table-item"><span class="table-item__label">详细地址：</span>{{ row?.receiverAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column label="卖家备注" width="180">
        <template #default="{ row }">
          <SellerRemark :rowData="row" @getTableData="getTableData" />
        </template>
      </el-table-column>
      <!-- <el-table-column prop="buyerRemark" label="买家留言"></el-table-column> -->
      <el-table-column prop="orderStatus" label="订单状态" width="100">
        <template #default="{ row }">
          <div>
            <div class="status-box">
              <span class="status-box__text">{{
                ORDER_STATUS_LIST?.find((item) => item.value === row?.orderStatus)?.label || '-'
              }}</span>
            </div>
            <el-popover v-if="row?.refundStatus" placement="top" title="退款记录" width="500">
              <template #reference>
                <el-button class="refund-record" link type="primary">退款记录</el-button>
              </template>
              <el-table :data="[{ ...row }]">
                <el-table-column prop="refundId" label="退款单id" />
                <el-table-column prop="refundPrice" label="退款金额">
                  <template #default="{ row }">
                    <span>￥{{ row?.refundPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="refundFinishTime" label="退款完成时间">
                  <template #default="{ row }">
                    <span>{{ formatDate(row?.refundFinishTime) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="refundStatus" label="退款状态">
                  <template #default="{ row }">
                    <span>{{ REFUND_STATUS_LIST?.find((item) => item.value === row?.refundStatus)?.label }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </div>

          <div v-if="row?.waybillCompanyName" class="waybill-company">{{ row?.waybillCompanyName }}</div>
          <div v-if="row?.waybillCode" class="table-item">
            <span class="table-item__label">运单号：</span>{{ row?.waybillCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ row }">
          <div class="operation-box">
            <!-- 退款中和退款成功 不允许操作 -->
            <template v-if="![REFUND_STATUS.PROCESS, REFUND_STATUS.SUCCESS].includes(row?.refundStatus)">
              <el-button
                v-if="[ORDER_STATUS.OUT_PROCESS].includes(row?.orderStatus)"
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
              <el-button
                v-if="row?.orderStatus === ORDER_STATUS.HAS_OUT"
                link
                type="primary"
                @click="confirmReceive(row)"
                >确认收货</el-button
              >
              <el-button
                v-if="[ORDER_STATUS.WAIT_OUT, ORDER_STATUS.OUT_PROCESS].includes(row?.orderStatus)"
                link
                type="primary"
                @click="printOutOrder(row)"
                >{{ row?.orderStatus === ORDER_STATUS.WAIT_OUT ? '打印出库单' : '重新打印出库单' }}</el-button
              >
              <el-button v-if="row?.orderStatus === ORDER_STATUS.WAIT_PAY" link type="primary" @click="cancelOrder(row)"
                >取消订单</el-button
              >
              <el-button
                v-if="
                  [
                    ORDER_STATUS.WAIT_OUT,
                    ORDER_STATUS.OUT_PROCESS,
                    ORDER_STATUS.HAS_OUT,
                    ORDER_STATUS.COMPLETED,
                  ].includes(row?.orderStatus)
                "
                link
                type="primary"
                @click="refundOrder(row)"
                >取消并退款</el-button
              >
            </template>
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
  <BatchOut ref="batchOutRef" @getTableData="getTableData" />
  <BatchExport ref="batchExportRef" :export-configs="exportConfigs" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import {
  TAB_ID,
  ORDER_STATUS_LIST,
  ORDER_STATUS,
  PAY_METHOD_LIST,
  REFUND_STATUS,
  REFUND_STATUS_LIST,
  orderSchema,
} from './constants.ts'
import * as apis from '@/api/services'
import { AdvCustomTooltip, PageTitle, BatchExport } from '@/components'
import { formatDate } from '@/utils/index.ts'
import { UploadWaybill, PrintWaybill, BatchOut, SellerRemark } from './components'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

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
const tableData = ref<Array<any>>([])
const selectList = ref<Array<any>>([])
const orderFormRef = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const uploadWayBillRef = ref()
const printWaybillRef = ref()
const batchOutRef = ref()
const batchExportRef = ref()
const tableLoading = ref<boolean>(false)

const exportConfigs = computed(() =>
  orderSchema.map((item) => ({
    ...item,
    value: searchForm[item.field] || null,
  })),
)

const getTableData = async () => {
  try {
    tableLoading.value = true
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
  tableLoading.value = false
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

const handleSelectionChange = (list: Array<any>) => {
  selectList.value = list
}

/**
 * @description: 打印出库单
 */
const printOutOrder = async (row: Record<string, any>) => {
  try {
    const { waybillInfoList = [] } = await apis.printOutOrder({ orderId: row?.id })
    if (waybillInfoList?.[0]?.waybillUrl) {
      ElMessage.success('生成出库单成功')
      window.open(waybillInfoList?.[0]?.waybillUrl)
      getTableData()
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
 * @description: 批量前置校验
 */
const batchPreCheck = () => {
  if (!selectList.value?.length) {
    ElMessage.warning('请先选择订单')
    return false
  }
  return true
}

/**
 * @description: 出库
 * @param {Object} row 行信息
 */
const uploadWaybillNum = (row: Record<string, any>) => {
  uploadWayBillRef.value?.open(row)
}

/**
 * @description: 批量出库
 */
const batchOut = async () => {
  batchOutRef.value?.open(selectList.value)
}

/**
 * @description: 批量打印出库单
 */
const batchPrintOut = async () => {
  let loading: any = null
  try {
    const valid = batchPreCheck()
    if (!valid) return
    const allOrderIds = selectList.value?.map((item) => item?.id)
    const validIds = selectList.value
      ?.filter((item) => [ORDER_STATUS.WAIT_OUT, ORDER_STATUS.OUT_PROCESS].includes(item?.orderStatus))
      ?.map((item) => item?.id)
    if (!validIds?.length) {
      ElMessage.warning('所选订单均不可打印出库单')
      return
    }
    await ElMessageBox.confirm(
      `您选中的${allOrderIds?.length}单订单中，有${validIds?.length}单可打印出库单，确定打印吗？`,
      '提示',
      {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning',
      },
    ).then(() => true)
    loading = ElLoading.service({
      lock: true,
      text: '生成打印单中...',
    })
    const { waybillInfoList = [], mergeWaybillUrl } = await apis.printOutOrder({ orderIdList: validIds })
    loading?.close()
    getTableData()
    const errorList = waybillInfoList?.filter((item) => !item?.success)
    if (errorList?.length) {
      ElMessageBox.confirm(
        `${errorList?.map((item) => `<div>${item?.id}：${item?.errorMsg}</div>`)?.join('')}`,
        `${errorList.length}单打印失败，原因如下`,
        {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning',
          dangerouslyUseHTMLString: true,
        },
      )
        .then(() => true)
        .catch(() => false)
    } else {
      ElMessage.success('生成出库单成功')
    }
    if (mergeWaybillUrl) window.open(mergeWaybillUrl)
  } catch (error) {
    if (loading) loading?.close()
    console.log(error)
  }
}

/**
 * @description: 订单导出
 */
const batchExport = () => {
  batchExportRef.value?.open()
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
      ElMessage.success('退款发起成功，请刷新查看状态')
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
