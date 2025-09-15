<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增活动场"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动投放渠道" prop="wayType">
        <el-radio-group v-model="form.wayType">
          <el-radio v-for="item in WAY_TYPE_LIST" :value="item.value" :key="item.value">{{ item?.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          v-model="form.activityTime"
          type="datetimerange"
          start-placeholder="活动开始时间"
          end-placeholder="活动结束时间"
          value-format="x"
          :teleported="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        />
      </el-form-item>
      <el-form-item label="活动优惠类型" prop="activityType">
        <el-radio-group v-model="form.activityType">
          <el-radio v-for="item in ACTIVITY_TYPE_LIST" :value="item.value" :key="item.value">{{
            item?.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.activityType === ACTIVITY_TYPE.DISCOUNT" label="折扣" prop="discount">
        <el-input-number
          v-model="form.discount"
          controls-position="right"
          step-strictly
          :min="0.1"
          :max="9.9"
          :step="0.1"
          placeholder="请输入折扣"
        ></el-input-number>
        <span class="discount-unit">折</span>
      </el-form-item>
      <div v-else-if="form.activityType === ACTIVITY_TYPE.MONEY_OFF" class="discount-box">
        <el-form-item label="满" prop="reachPrice">
          <el-input-number
            v-model="form.reachPrice"
            controls-position="right"
            step-strictly
            :min="0"
            :step="0.01"
            placeholder="请输入满减价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="元，减" prop="reducePrice" label-width="auto" class="hide-required-icon">
          <el-input-number
            v-model="form.reducePrice"
            controls-position="right"
            step-strictly
            :min="0"
            :step="0.01"
            placeholder="请输入满减价"
          ></el-input-number>
        </el-form-item>
        <span class="discount-unit">元</span>
      </div>

      <el-form-item label="覆盖商品" prop="productIdList">
        <CommonProduct v-model="form.productIdList" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { WAY_TYPE, WAY_TYPE_LIST, ACTIVITY_TYPE_LIST, ACTIVITY_TYPE } from '../../constants'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { CommonProduct } from '@/components'

const emit = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const formRef = ref()
const form = reactive({
  id: null,
  name: null,
  wayType: WAY_TYPE.ONLINE,
  activityTime: [],
  activityType: ACTIVITY_TYPE.MONEY_OFF,
  discount: null,
  reachPrice: null,
  reducePrice: null,
  productIdList: [],
})
const rowData = ref()
const isEdit = computed(() => !!rowData.value)

const rules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  wayType: [{ required: true, message: '请选择活动投放渠道', trigger: 'change' }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  activityType: [{ required: true, message: '请选择活动优惠类型', trigger: 'change' }],
  discount: [{ required: true, message: '请输入折扣', trigger: 'blur' }],
  reachPrice: [{ required: true, message: '请输入满减价格', trigger: 'blur' }],
  reducePrice: [{ required: true, message: '请输入满减价格', trigger: 'blur' }],
  productIdList: [{ required: true, message: '请选择商品', trigger: 'change' }],
}

const closeHandler = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: null,
    name: null,
    wayType: WAY_TYPE.ONLINE,
    activityTime: [],
    activityType: ACTIVITY_TYPE.MONEY_OFF,
    discount: null,
    reachPrice: null,
    reducePrice: null,
    productIdList: [],
  })
}

/**
 * @description: 获取详情信息
 */
const getDetailData = async () => {
  try {
    const data = await apis?.getActivityDetail({
      id: Number(rowData.value?.id),
    })
    Object.assign(form, {
      ...data,
      activityTime: data?.startTime && data?.endTime ? [data?.startTime, data?.endTime] : [],
    })
  } catch {
    ElMessage.error('获取活动详情失败')
  }
}

const open = async (row: Record<string, any>) => {
  rowData.value = row
  if (row) {
    getDetailData()
  }
  dialogVisible.value = true
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    const apiName = isEdit.value ? 'updateActivity' : 'addActivity'
    try {
      const res = await apis?.[apiName]({
        id: rowData.value?.id,
        name: form?.name,
        wayType: form?.wayType,
        startTime: form?.activityTime?.[0],
        endTime: form?.activityTime?.[1],
        activityType: form?.activityType,
        discount: form?.discount,
        reachPrice: form?.reachPrice,
        reducePrice: form?.reducePrice,
        productIdList: form?.productIdList,
      })
      if (res) {
        ElMessage.success('保存成功')
        emit('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('保存失败')
      }
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
