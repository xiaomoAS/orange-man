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

  <AddUserDialog ref="addUserRef" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { PageTitle } from '@/components'
import { AddUserDialog } from './components'

const tableData = ref([])
const searchFormRef = ref()
const addUserRef = ref()
const searchForm = reactive({
  userName: null,
})

const getTableData = async () => {
  try {
    tableData.value = await apis.getUserList({
      ...searchForm,
    })
  } catch {
    tableData.value = []
  }
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
    await apis.deleteUser({ id: row?.id })
    ElMessage.success('删除成功')
    getTableData()
  } catch {
    ElMessage.error('删除失败')
  }
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
