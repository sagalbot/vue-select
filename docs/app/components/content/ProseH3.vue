<template>
  <h3 :id="id"><slot /></h3>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
