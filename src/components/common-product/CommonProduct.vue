<template>
  <el-select v-model="curValue" placeholder="请选择商品" clearable multiple>
    <el-option v-for="item in productOptions" :key="item?.id" :label="item?.name" :value="item?.id" />
  </el-select>
</template>

<script setup lang="ts">
import * as apis from '@/api/services'
import { ref, computed, onMounted } from 'vue'

export interface Props {
  modelValue: Array<any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const emit = defineEmits(['update:modelValue'])
const productOptions = ref<Array<any>>([])

const curValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const initData = async () => {
  try {
    productOptions.value = await apis?.getAllProducts({})
  } catch {
    productOptions.value = []
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
