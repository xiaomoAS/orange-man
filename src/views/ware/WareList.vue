<!--
 * @Autor: jiangzupei
 * @Description: 
 * @Date: 2025-06-30 17:04:54
 * @LastEditors: jiangzupei1 jiangzupei1@jd.com
 * @LastEditTime: 2025-08-14 10:32:33
 * @FilePath: /orange-man/src/views/ware/WareList.vue
-->
<template>
  <div>
    <!-- 导航栏 -->
    <div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部商品(999+)" :name="TAB_ID.ALL"></el-tab-pane>
        <el-tab-pane label="售卖中(757)" :name="TAB_ID.ONSALE"></el-tab-pane>
        <el-tab-pane label="已下架(999+)" :name="TAB_ID.OFFLINE"></el-tab-pane>
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
        <el-button>批量上架</el-button>
        <el-button>批量下架</el-button>
        <el-button>批量删除</el-button>
      </div>

      <div class="batch-buttons__right">
        <el-button type="primary" link>类目设置</el-button>
        <el-button type="primary" link>+ 添加新商品</el-button>
      </div>
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
          <el-button link type="primary">修改商品</el-button>
          <el-button link type="primary">上架/下架商品</el-button>
          <el-button link type="primary">修改检测报告</el-button>
          <el-button link type="primary">删除商品</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { TAB_ID } from './constants.ts'
import * as apis from '@/api/services'

const activeTab = ref(TAB_ID.ONSALE)
const searchForm = ref({
  productId: undefined,
  categoryId: undefined,
  price: undefined,
  wareNum: undefined,
})
const tableData = ref([
  {
    name: '威拓森 (weitousen) 游钓中国鱼竿维把带硅胶手把带钓鱼竿龙骨吸汗带防滑防电',
    code: '10026126154955',
    stock: 15,
    price: '¥22.80 - ¥44.80',
    updateTime: '2025-04-10 15:32:23',
    status: '上架',
  },
])
const totalCount = ref(0)

const onSubmit = () => {}

const getWareList = async () => {
  try {
    const { rows, total } = await apis.getWareList({})
    tableData.value = rows
    totalCount.value = total
  } catch {
    tableData.value = []
    totalCount.value = 0
  }
}

onMounted(() => {
  getWareList()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
