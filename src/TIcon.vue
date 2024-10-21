<script setup lang="ts">
// @license MIT https://tdesign.tencent.com/design/icon

defineProps<{
  i: 'chevron-left' | 'chevron-right';
}>();
</script>

<style scoped>
svg {
  width: 1em;
  aspect-ratio: 1;
}
</style>
<template>
  <svg v-if="$props.i === 'chevron-left'" viewBox="0 0 24 24">
    <path
      d="M15.9144 17.5L10.4144 12L15.9144 6.50003L14.5002 5.08582L7.58594 12L14.5002 18.9142L15.9144 17.5Z"
      fill="currentColor"
    />
  </svg>
  <svg v-else-if="$props.i === 'chevron-right'" viewBox="0 0 24 24">
    <path
      d="M8.08594 17.5L13.5859 12L8.08594 6.50003L9.50015 5.08582L16.4144 12L9.50015 18.9142L8.08594 17.5Z"
      fill="currentColor"
    />
  </svg>
</template>
