<template>
  <el-select v-model="curValue" placeholder="请选择类目" clearable>
    <el-option v-for="item in cateOptions" :key="item?.id" :label="item?.name" :value="item?.id" />
  </el-select>
</template>

<script setup lang="ts">
import * as apis from '@/api/services'
import { ref, computed, onMounted } from 'vue'

export interface Props {
  modelValue: number | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
})

const emit = defineEmits(['update:modelValue'])
const cateOptions = ref<Array<any>>([])

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
    cateOptions.value = await apis?.getAllCates({})
  } catch {
    cateOptions.value = []
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
