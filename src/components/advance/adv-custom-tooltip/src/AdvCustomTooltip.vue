<template>
  <el-tooltip v-bind="{ ...defaultTooltipProps, ...props?.tooltipProps }" :disabled="isShowTooltip">
    <template #content>
      <slot name="content"></slot>
    </template>
    <div
      class="over-content-disabled"
      :style="contentWrapStyle"
      @mouseover="handleMouseOver"
      @focus="() => {}"
    >
      <span ref="contentRef"><slot></slot></span>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  showLine?: number
  tooltipProps?: any
}

const props = withDefaults(defineProps<Props>(), {
  showLine: 1,
  tooltipProps: {
    placement: 'top-start',
    effect: 'light',
  },
})

const isShowTooltip = ref(false)
const contentRef = ref()
const defaultTooltipProps = {
  placement: 'top-start',
  effect: 'light',
}
const contentWrapStyle = computed(() => ({
  '-webkit-line-clamp': props.showLine,
}))

const handleMouseOver = () => {
  const parentHeight = contentRef.value?.parentNode?.offsetHeight || 0
  const contentHeight = contentRef.value?.offsetHeight || 0
  isShowTooltip.value = contentHeight <= parentHeight
}
</script>
<style scoped lang="scss">
.over-content-disabled {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}
</style>
