<template>
  <div class="page-title">{{ title }}</div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

withDefaults(defineProps<Props>(), {
  title: '',
})
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
