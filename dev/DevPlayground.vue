<script lang="ts" setup>
import { ref } from 'vue'
import VueSelect, {
  ComboBox,
  ComboBoxButton,
  ComboBoxInput,
  ComboBoxMenu,
  ComboBoxOption,
} from '@/index'
import { countriesAndCodes } from '@docs/assets/static/data'

const single = ref(null)
const multiple = ref([])
const headless = ref(null)
</script>

<template>
  <div class="mx-auto max-w-md space-y-10 py-20">
    <section class="space-y-2">
      <h2 class="font-semibold">VueSelect</h2>
      <VueSelect v-model="single" :options="countriesAndCodes" placeholder="Choose a country" />
      <pre class="text-xs">{{ single }}</pre>
    </section>

    <section class="space-y-2">
      <h2 class="font-semibold">VueSelect, multiple</h2>
      <VueSelect v-model="multiple" :options="countriesAndCodes" multiple />
      <pre class="text-xs">{{ multiple }}</pre>
    </section>

    <section class="space-y-2">
      <h2 class="font-semibold">Headless primitives</h2>
      <ComboBox
        v-slot="{ filteredOptions }"
        v-model="headless"
        :options="countriesAndCodes"
        class="relative"
      >
        <div class="flex rounded border focus-within:ring-2 focus-within:ring-indigo-500">
          <ComboBoxInput class="min-w-0 flex-1 px-2 py-1 outline-none" />
          <ComboBoxButton class="px-2 text-gray-400">▾</ComboBoxButton>
        </div>
        <ComboBoxMenu
          class="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded border bg-white"
        >
          <ComboBoxOption
            v-for="(country, index) in filteredOptions"
            :key="index"
            v-slot="{ isSelected, isHighlighted }"
            :value="country"
            :index="index"
          >
            <div
              class="cursor-pointer px-2 py-1"
              :class="{ 'bg-indigo-600 text-white': isHighlighted, 'font-semibold': isSelected }"
            >
              {{ country.label }}
            </div>
          </ComboBoxOption>
        </ComboBoxMenu>
      </ComboBox>
      <pre class="text-xs">{{ headless }}</pre>
    </section>
  </div>
</template>
