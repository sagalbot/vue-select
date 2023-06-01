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

/**
 * @feat noDrop 為 true 時的樣式
 */
const attrs = useAttrs()
const noDropBackgroundColor = computed(() =>
  attrs['no-drop'] ? '#f7f7f7' : '#fff'
)
const noDropCursor = computed(() => (attrs['no-drop'] ? 'default' : 'pointer'))

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
      class="cursor-auto"
      v-bind="$attrs"
      :clearable="false"
      :searchable="searchable"
      label="name"
      append-to-body
      transition="fade"
    >
      <template #selected-option="{ name }">
        <p class="">{{ name }}</p>
      </template>

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
// v-select 為套件內最上層的 class
:deep(.vs__dropdown-toggle) {
  border-radius: v-bind(borderRadius);
  box-shadow: var(--input-shadow);
  background-color: v-bind(noDropBackgroundColor);
}

// 在 iphone 上 vue-select 莫名會多出 input.vs__search 的 padding 導致元件跑版
:deep(.vs__dropdown-toggle .vs__selected-options input.vs__search) {
  // -webkit-appearance: none;
  padding: 0;
  position: relative;
  left: var(--vselect-left-space);
}

// 調整左右間距
:deep(.vs__dropdown-toggle .vs__selected-options) {
  position: relative;
  left: var(--vselect-left-space);
  flex-wrap: nowrap;
}
:deep(.vs__dropdown-toggle .vs__actions) {
  position: relative;
  right: var(--vselect-right-space);
}

// ============== no-drop 為 true 時的樣式 ==============
:deep(.vs--unsearchable .vs__dropdown-toggle) {
  cursor: v-bind(noDropCursor);
}

:deep(.vs--unsearchable:not(.vs--disabled) .vs__search) {
  cursor: v-bind(noDropCursor);
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
