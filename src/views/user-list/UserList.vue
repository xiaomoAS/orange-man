<template>
  <PageTitle title="用户权限列表" />

  <el-form ref="searchFormRef" class="form-box" :model="searchForm" label-width="120px">
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="searchForm.userName" placeholder="请输入用户名" />
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
      <el-button type="primary" @click="modifyUserHandler()">添加用户</el-button>
    </div>
  </div>

  <el-table :data="tableData" class="user-table">
    <el-table-column label="用户id" prop="id" width="100"></el-table-column>
    <el-table-column label="用户名" prop="userName"></el-table-column>
    <el-table-column label="密码" prop="password"></el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <div>
          <el-button link type="primary" @click="modifyUserHandler(row)">修改</el-button>
          <el-button link type="primary" @click="deleteUser(row)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <AddUserDialog ref="addUserRef" @getTableData="getTableData" />

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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as apis from '@/api/services'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PageTitle } from '@/components'
import { AddUserDialog } from './components'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const searchFormRef = ref()
const addUserRef = ref()
const searchForm = reactive({
  userName: null,
})

const getTableData = async () => {
  try {
    const { rows, total } = await apis.getUserList({
      ...searchForm,
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
 * @description: 添加用户
 */
const modifyUserHandler = (row = null) => {
  addUserRef.value?.open(row)
}

/**
 * @description: 删除用户
 * @param {Object} row 行数据
 */
const deleteUser = async (row: Record<string, any>) => {
  try {
    await ElMessageBox.confirm(`确认删除吗`, '提示', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
    }).then(() => true)
    const res = await apis.deleteUser({ id: row?.id })
    if (res) {
      ElMessage.success('删除成功')
      getTableData()
    } else {
      ElMessage.error('删除失败')
    }
  } catch {}
}

const reset = () => {
  searchFormRef.value?.resetFields()
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
