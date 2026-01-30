<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import StyledComboBox from '@/components/ComboBox/StyledComboBox.vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import ComboBoxButton from '@/components/ComboBox/ComboBoxButton.vue'
import { countriesAndCodes } from '@docs/assets/static/data'
import { ref } from 'vue'

const selected = ref<{
  styled: { id: string; label: string } | null
  default: { id: string; label: string } | null
}>({
  styled: null,
  default: null,
})
</script>

<template>
  <div class="flex flex-col items-center space-y-10 justify-center pt-40">
    <StyledComboBox
      :label="({ label }) => label"
      v-model="selected.styled"
      :options="countriesAndCodes"
    >
      <ComboBoxOption
        @click="selected.styled = country"
        v-for="country in countriesAndCodes"
        :key="country.id"
        :class="['px-2 py-1']"
        :value="country"
        #default="{ isSelected }"
      >
        <span :class="{ 'text-indigo-600': isSelected }">
          {{ country.label }}
        </span>
      </ComboBoxOption>
    </StyledComboBox>

    <ComboBox v-model="selected" class="text-left w-64 relative">
      <ComboBoxButton
        as="div"
        class="px-2 border flex rounded items-center justify-center h-12 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <div class="flex-1">
          {{ selected.default?.label }}
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
      </ComboBoxButton>

      <ComboBoxMenu
        class="absolute mt-1 left-0 w-full h-64 overflow-y-scroll space-y-1 border rounded"
      >
        <ComboBoxOption
          @click="selected = country"
          v-for="country in countriesAndCodes"
          as="button"
          :key="country.id"
          :class="['px-2 py-1 flex text-left hover:bg-gray-100 w-full']"
          :value="country"
          #default="{ isSelected }"
        >
          <span :class="{ 'text-indigo-600': isSelected }">
            {{ country.label }}
          </span>
        </ComboBoxOption>
      </ComboBoxMenu>
    </ComboBox>
  </div>
</template>
