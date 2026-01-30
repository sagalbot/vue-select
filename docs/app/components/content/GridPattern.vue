<script setup lang="ts">
defineProps<{
  width: string
  height: string
  x: number
  y: number
  squares: boolean
}>()
</script>

<template>
  <svg aria-hidden="true" v-bind="$attrs">
    <defs>
      <pattern
        :id="patternId"
        :width="width"
        :height="height"
        patternUnits="userSpaceOnUse"
        :x="x"
        :y="y"
      >
        <path :d="`M.5 ${height}V.5H${width}`" fill="none" />
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      :stroke-width="0"
      :fill="`url(#${patternId})`"
    />
    <svg v-if="squares" :x="x" :y="y" class="overflow-visible">
      <rect
        v-for="square in squares"
        :key="`${square[0]}-${square[1]}`"
        width="width + 1"
        height="height + 1"
        :x="square[0] * width"
        :y="square[1] * height"
      />
    </svg>
  </svg>
</template>
