<!--
 * @Autor: jiangzupei
 * @Description: 
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-09-18 09:52:09
 * @FilePath: /orange-man/src/views/ware/WareList.vue
-->
<template>
  <div>
    <PageTitle title="商品列表" />

    <!-- 导航栏 -->
    <div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部商品" :name="TAB_ID.ALL"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 筛选条件 -->
    <el-form ref="wareFormRef" class="form-box" :model="searchForm" label-width="120px">
      <el-form-item label="商品编码" prop="productId">
        <el-input v-model="searchForm.productId" placeholder="请输入商品Id" />
      </el-form-item>
      <el-form-item label="商品状态" prop="productStatus">
        <el-select v-model="searchForm.productStatus" placeholder="请选择状态">
          <el-option v-for="item in PRODUCT_STATUS_LIST" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类目" prop="categoryId">
        <CommonCate v-model="searchForm.categoryId" />
      </el-form-item>
      <el-form-item label="最小价格" prop="priceMin">
        <el-input-number
          v-model="searchForm.priceMin"
          step-strictly
          controls-position="right"
          placeholder="输入最小价格"
          :step="0.01"
        />
      </el-form-item>
      <el-form-item label="最大价格" prop="priceMax">
        <el-input-number
          v-model="searchForm.priceMax"
          step-strictly
          controls-position="right"
          placeholder="输入最大价格"
          :step="0.01"
        />
      </el-form-item>
      <el-form-item label="最小库存" prop="inventoryMin">
        <el-input-number
          v-model="searchForm.inventoryMin"
          step-strictly
          controls-position="right"
          placeholder="输入最小库存"
          :step="1"
        />
      </el-form-item>
      <el-form-item label="最大库存" prop="inventoryMax">
        <el-input-number
          v-model="searchForm.inventoryMax"
          step-strictly
          controls-position="right"
          placeholder="输入最大库存"
          :step="1"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left">
        <!-- <el-button>批量上架</el-button>
        <el-button>批量下架</el-button>
        <el-button>批量删除</el-button> -->
      </div>

      <div class="batch-buttons__right">
        <el-button type="primary" @click="cateConfigHandler">类目设置</el-button>
        <el-button type="primary" @click="editGoodsHandler()">+ 添加新商品</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" current-row-key="id" class="ware-table">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="商品信息" width="400">
        <template #default="{ row }">
          <div class="product-info">
            <img class="product-info__img" :src="row?.imgUrl" alt="商品图" />
            <div>
              <AdvCustomTooltip :showLine="2" :content="row.title">
                <span class="product-info__title">{{ row.title }}</span>
              </AdvCustomTooltip>
              <div>商品编码：{{ row.productId }}</div>
              <div>类目：{{ row?.categoryName }}（ID：{{ row?.categoryId }}）</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存"></el-table-column>
      <el-table-column label="价格">
        <template #default="{ row }">
          <span
            >¥{{ row?.price }}<span v-if="row?.specType">/{{ SPEC_NAME?.[row?.specType] }}</span></span
          >
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="{ row }">
          <span>{{ formatDate(row?.modifiedTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productStatus" label="商品状态">
        <template #default="{ row }">
          {{ PRODUCT_STATUS_LIST?.find((item) => item.value === row?.productStatus)?.label }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="operation-box">
            <el-button link type="primary" @click="editGoodsHandler(row)">修改商品</el-button>
            <el-button
              v-if="
                [PRODUCT_STATUS.IS_OFF_SHELF, PRODUCT_STATUS.WAIT_ON_SHELF, PRODUCT_STATUS.IS_ON_SHELF].includes(
                  row.productStatus,
                )
              "
              link
              type="primary"
              @click="shelfHandler(row)"
              >上架/下架商品</el-button
            >
            <!-- <el-button link type="primary">修改检测报告</el-button> -->
            <el-button link type="primary" @click="deleteWare(row)">删除商品</el-button>
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

  <AddGoodsDialog ref="addGoodsDialogRef" @getTableData="getTableData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AdvCustomTooltip, PageTitle, CommonCate } from '@/components'
import { TAB_ID, PRODUCT_STATUS_LIST, PRODUCT_STATUS, SPEC_NAME } from './constants.ts'
import * as apis from '@/api/services'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AddGoodsDialog } from './components'
import { formatDate } from '@/utils'

const router = useRouter()
const activeTab = ref(TAB_ID.ALL)
const wareFormRef = ref()
const searchForm = ref({
  productId: null,
  productStatus: null,
  categoryId: null,
  priceMin: null,
  priceMax: null,
  inventoryMin: null,
  inventoryMax: null,
})
const tableData = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const addGoodsDialogRef = ref()

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getWareList({
      ...searchForm.value,
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
 * @description: 上下架
 */
const shelfHandler = async (row: Record<string, any>) => {
  try {
    let res = true
    let apiName = ''
    // 待上架&已下架
    if ([PRODUCT_STATUS.IS_OFF_SHELF, PRODUCT_STATUS.WAIT_ON_SHELF].includes(row.productStatus)) {
      apiName = 'wareOnline'
    }
    // 已上架
    else if ([PRODUCT_STATUS.IS_ON_SHELF].includes(row.productStatus)) {
      apiName = 'wareOffline'
    }
    if (!apiName) {
      ElMessage.warning('非目标状态')
      return
    }
    await ElMessageBox.confirm(
      `确认${[PRODUCT_STATUS.IS_ON_SHELF].includes(row.productStatus) ? '下架' : '上架'}吗`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    ).then(() => true)
    res = await (apis as any)?.[apiName]({
      productStatus: row?.productStatus,
      productId: Number(row?.productId),
    })
    if (res) {
      ElMessage.success('处理成功')
    } else {
      ElMessage.error('处理失败')
    }
  } catch {}
}

/**
 * @description: 删除商品
 */
const deleteWare = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认删除吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.wareDelete({
      productStatus: row?.productStatus,
      productId: Number(row?.productId),
    })
    if (res) {
      ElMessage.success('删除成功')
      getTableData()
    } else {
      ElMessage.error('删除失败')
    }
  } catch {}
}

const reset = () => {
  wareFormRef.value?.resetFields()
  getTableData()
}

const cateConfigHandler = () => {
  router.push('/cateConfig')
}

const editGoodsHandler = (row = null) => {
  addGoodsDialogRef.value?.open(row)
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
