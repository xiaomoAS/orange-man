<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增优惠券"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeHandler"
  >
    <div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="isEdit" label="券ID" prop="id">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="券名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入券名称"></el-input>
        </el-form-item>
        <el-form-item label="券类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择券类型">
            <el-option v-for="item in COUPON_LIST" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form?.type === COUPON_TYPE.NEW_DISCOUNT" label="普通优惠券" prop="newPersonPrice">
          <el-input-number
            v-model="form.newPersonPrice"
            placeholder="请输入"
            :min="0"
            :step="0.01"
            step-strictly
          ></el-input-number>
          <span class="unit">元</span>
        </el-form-item>
        <el-form-item v-if="form?.type === COUPON_TYPE.FREIGHT" label="包邮运费上限" prop="waybillPriceLimit">
          <el-input-number
            v-model="form.waybillPriceLimit"
            placeholder="请输入"
            :min="0"
            :step="0.01"
            step-strictly
          ></el-input-number>
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="覆盖商品" prop="productIdList">
          <CommonProduct v-model="form.productIdList" />
        </el-form-item>
        <el-form-item label="覆盖用户数" prop="converUserCount">
          <el-input v-model.number="form.converUserCount" type="number" placeholder="请输入覆盖用户数"></el-input>
        </el-form-item>

        <el-form-item label="生效时间范围" prop="couponTime">
          <el-date-picker
            v-model="form.couponTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="x"
            :teleported="false"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item label="发放方式" prop="publishType">
          <el-radio-group v-model="form.publishType">
            <el-radio v-for="item in PUBLISH_LIST" :value="item.value" :key="item.value">{{ item?.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { COUPON_LIST, PUBLISH_LIST, COUPON_TYPE } from '../../constants'
import { CommonProduct } from '@/components'

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  productIdList: [{ required: true, message: '请选择商品', trigger: 'change' }],
  converUserCount: [{ required: true, message: '请输入覆盖用户数', trigger: 'change' }],
  waybillPriceLimit: [{ required: true, message: '请输入价格', trigger: 'change' }],
  newPersonPrice: [{ required: true, message: '请输入价格', trigger: 'change' }],
  couponTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  publishType: [{ required: true, message: '请选择发放方式', trigger: 'change' }],
}

const emits = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const rowData = ref()
const formRef = ref()
const form = reactive<Record<string, any>>({
  id: undefined,
  name: null,
  type: null,
  productIdList: [],
  converUserCount: null,
  waybillPriceLimit: null,
  newPersonPrice: null,
  publishType: null,
  couponTime: [],
})
const isEdit = computed(() => !!rowData.value)

const open = (data: Record<string, any>) => {
  rowData.value = data
  Object.assign(form, {
    ...data,
    couponTime: data?.startTime ? [data?.startTime, data?.endTime] : [],
  })
  dialogVisible.value = true
}

const closeHandler = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: undefined,
    name: null,
    type: null,
    productIdList: [],
    converUserCount: null,
    waybillPriceLimit: null,
    newPersonPrice: null,
    publishType: null,
    couponTime: [],
  })
}

const submitHandler = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateCoupon' : 'addCoupon'
      const res = await apis?.[apiName]({
        ...form,
        couponTime: undefined,
        startTime: form?.couponTime?.[0],
        endTime: form?.couponTime?.[1],
      })
      if (res) {
        ElMessage.success('添加成功')
        emits('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('添加失败')
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
