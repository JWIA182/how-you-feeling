<script setup lang="ts">
defineProps<{
  message: string
  show: boolean
}>()
</script>

<template>
  <Transition name="toast">
    <div v-if="show" class="toast">{{ message }}</div>
  </Transition>
</template>
