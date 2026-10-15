<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const tags = ref(['vue'])

// Comma selects like Enter (v3: select-on-key-codes="[188, 13]").
// Tab selects the highlighted option and still moves focus (v3: select-on-tab).
const mapKeydown = (map, ctx) => ({
  ...map,
  ',': map.Enter,
  Tab: () => {
    if (ctx.open.value) ctx.typeAheadSelect()
  },
})
</script>

<template>
  <div id="upgrade-map-keydown" class="not-prose" style="margin: 1.5rem 0">
    <VueSelect
      v-model="tags"
      multiple
      taggable
      :options="['vue', 'react', 'svelte', 'solid', 'angular']"
      :map-keydown="mapKeydown"
      :input-attrs="{ 'aria-label': 'Tags' }"
    />
  </div>
</template>
