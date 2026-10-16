<script setup lang="ts">
import { ref, computed } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import { countriesAndCodes } from '~/assets/static/data'
import type { OptionValue } from '@/types'

const flags = ref({
  multiple: false,
  taggable: false,
  disabled: false,
  loading: false,
  clearable: true,
  searchable: true,
  grouped: false,
  appendToBody: false,
  openOnFocus: false,
})

const v4Value = ref<unknown>(null)

const groupByLetter = (option: OptionValue) =>
  typeof option === 'object' ? String(option.label)[0] : null

const shared = computed(() => ({
  options: countriesAndCodes,
  multiple: flags.value.multiple,
  taggable: flags.value.taggable,
  disabled: flags.value.disabled,
  loading: flags.value.loading,
  clearable: flags.value.clearable,
  searchable: flags.value.searchable,
  placeholder: 'Choose a country',
}))

const v4Only = computed(() => ({
  groupBy: flags.value.grouped ? groupByLetter : undefined,
  appendTo: flags.value.appendToBody ? 'body' : undefined,
  openOnFocus: flags.value.openOnFocus,
}))

function reset() {
  v4Value.value = flags.value.multiple ? [] : null
}
</script>

<template>
  <div class="not-prose my-8 space-y-6">
    <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700 dark:text-slate-300">
      <label v-for="(_, name) in flags" :key="name" class="flex items-center gap-2">
        <input v-model="flags[name]" type="checkbox" @change="name === 'multiple' && reset()" />
        {{ name }}
      </label>
    </div>

    <div class="max-w-md space-y-2">
      <VueSelect
        :key="`v4-${flags.multiple}`"
        v-model="v4Value"
        v-bind="{ ...shared, ...v4Only }"
      />
      <pre class="rounded bg-slate-900 p-2 text-xs text-slate-100">{{ JSON.stringify(v4Value) }}</pre>
    </div>
  </div>
</template>
