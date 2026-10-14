<script setup lang="ts">
import { ref, computed } from 'vue'
import LegacySelect from '@/components/Select.vue'
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

const legacyValue = ref<unknown>(null)
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
  legacyValue.value = flags.value.multiple ? [] : null
  v4Value.value = flags.value.multiple ? [] : null
}
</script>

<template>
  <div class="not-prose my-8 space-y-6">
    <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700 dark:text-slate-300">
      <label v-for="(_, name) in flags" :key="name" class="flex items-center gap-2">
        <input v-model="flags[name]" type="checkbox" @change="name === 'multiple' && reset()" />
        {{ name }}
        <span v-if="['grouped', 'appendToBody', 'openOnFocus'].includes(name)" class="text-xs text-sky-600">
          v4 only
        </span>
      </label>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <div class="text-sm font-semibold text-slate-500">
          Current beta (<code>Select.vue</code>)
        </div>
        <LegacySelect
          :key="`legacy-${flags.multiple}`"
          v-model="legacyValue"
          v-bind="shared"
          :append-to-body="flags.appendToBody"
        />
        <pre class="rounded bg-slate-900 p-2 text-xs text-slate-100">{{ JSON.stringify(legacyValue) }}</pre>
      </div>
      <div class="space-y-2">
        <div class="text-sm font-semibold text-slate-500">
          v4 (<code>VueSelect.vue</code> on the primitives)
        </div>
        <VueSelect
          :key="`v4-${flags.multiple}`"
          v-model="v4Value"
          v-bind="{ ...shared, ...v4Only }"
        />
        <pre class="rounded bg-slate-900 p-2 text-xs text-slate-100">{{ JSON.stringify(v4Value) }}</pre>
      </div>
    </div>
  </div>
</template>
