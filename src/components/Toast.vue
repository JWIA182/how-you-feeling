<script setup lang="ts">
defineOptions({
  name: 'NotificationToast',
})

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
