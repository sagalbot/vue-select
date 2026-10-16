<!-- A user's own wrapper around the primitives, as the docs describe -->
<script setup lang="ts">
import {
  ComboBox,
  ComboBoxButton,
  ComboBoxInput,
  ComboBoxMenu,
  ComboBoxOption,
  comboBoxDefaults,
  type ComboBoxProps,
} from '../../../../src/index'

const props = withDefaults(defineProps<ComboBoxProps>(), comboBoxDefaults)
</script>

<template>
  <ComboBox v-slot="{ filteredOptions, clearSelection }" v-bind="props">
    <ComboBoxInput />
    <ComboBoxButton>Toggle</ComboBoxButton>
    <button class="clear" @click="clearSelection()">Clear</button>
    <ComboBoxMenu>
      <ComboBoxOption
        v-for="(option, index) in filteredOptions"
        :key="index"
        :value="option"
        :index="index"
      >
        {{ option }}
      </ComboBoxOption>
    </ComboBoxMenu>
  </ComboBox>
</template>
