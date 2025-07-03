<!--
 * @Autor: jiangzupei
 * @Description: 
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-07-03 16:36:04
 * @FilePath: /orange-man/src/views/orders/OrderManage.vue
-->
<template>
  <div>
    <!-- 导航栏 -->
    <div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部商品" :name="TAB_ID.ALL"></el-tab-pane>
        <el-tab-pane label="待付款" :name="TAB_ID.NOT_PAY"></el-tab-pane>
        <el-tab-pane label="待出库" :name="TAB_ID.WAIT_OUT"></el-tab-pane>
        <el-tab-pane label="已出库" :name="TAB_ID.HAS_OUT"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 筛选条件 -->
    <el-form class="form-box" :model="searchForm" label-width="120px">
      <el-form-item label="商品编码">
        <el-input v-model="searchForm.productId" />
      </el-form-item>
      <el-form-item label="类目">
        <el-input v-model="searchForm.categoryId" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="searchForm.price" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="searchForm.wareNum" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作 -->
    <div class="batch-buttons">
      <div class="batch-buttons__left">
        <el-button>批量打印</el-button>
        <el-button>批量上传运单号</el-button>
      </div>

      <div class="batch-buttons__right"></div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="商品信息"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="stock" label="总库存"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column prop="status" label="商品状态"></el-table-column>
      <el-table-column label="操作">
        <div class="operation-box">
          <el-button link type="primary">打印面单</el-button>
          <el-button link type="primary">上传运单号</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TAB_ID } from './constants.ts'

const activeTab = ref(TAB_ID.ALL)
const searchForm = ref({
  productId: undefined,
  categoryId: undefined,
  price: undefined,
  wareNum: undefined,
})
const tableData = [
  {
    name: '威拓森 (weitousen) 游钓中国鱼竿维把带硅胶手把带钓鱼竿龙骨吸汗带防滑防电',
    code: '10026126154955',
    stock: 15,
    price: '¥22.80 - ¥44.80',
    updateTime: '2025-04-10 15:32:23',
    status: '上架',
  },
]

const onSubmit = () => {}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
