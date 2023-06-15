<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    searchable?: boolean
    square?: boolean
  }>(),
  {
    searchable: false,
    square: false,
  }
)

const borderRadius = computed(() => {
  return props.square ? '8px' : '30px'
})

const attrs = useAttrs()

/**
 * @feat 將選擇的選項名稱加上粗體
 */
function selectedOptionNameClass(name: string) {
  if (name === (attrs.modelValue as any)?.name) {
    return 'font-semibold'
  }
  return ''
}
</script>

<template>
  <div>
    <v-select
      v-bind="$attrs"
      :clearable="false"
      :searchable="searchable"
      label="name"
      append-to-body
      transition="fade"
    >
      <template #option="{ name }">
        <div class="option--scroll">
          <p :class="selectedOptionNameClass(name)">{{ name }}</p>
        </div>
      </template>

      <template #no-options="{ search, searching, loading }">
        暫無選項
      </template>
    </v-select>
  </div>
</template>

<style lang="scss" scoped>
:deep(.vs__dropdown-toggle) {
  border-radius: v-bind(borderRadius); // 欄位外匡
  box-shadow: var(--input-shadow); // 欄位陰影
}

// vs__selected-options 調整左側間隔
:deep(.vs__dropdown-toggle .vs__selected-options) {
  padding-left: 15px;
}

// vs__selected 欄位文字過長橫軸滑動
:deep(.vs__dropdown-toggle .vs__selected-options .vs__selected) {
  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
:deep(.vs__dropdown-toggle
    .vs__selected-options
    .vs__selected::-webkit-scrollbar) {
  display: none;
}

.option--scroll {
  white-space: nowrap;
  overflow-x: auto;

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.option--scroll::-webkit-scrollbar {
  display: none;
}
</style>
