<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxMenu,
  ComboBoxOption,
} from '@/index'

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Plum']
const fruit = ref(null)
</script>

<template>
  <div class="demo not-prose">
    <label for="headless-basic-fruit" class="label">Fruit</label>
    <ComboBox
      v-slot="{ selected, search, filteredOptions }"
      v-model="fruit"
      :options="fruits"
      placeholder="Pick a fruit"
      class="combobox"
    >
      <div class="field">
        <span v-if="selected.length && !search" class="value">{{ selected[0] }}</span>
        <ComboBoxInput id="headless-basic-fruit" class="input" />
        <ComboBoxButton class="toggle" aria-label="Show fruits">▾</ComboBoxButton>
      </div>

      <ComboBoxMenu class="menu">
        <ComboBoxOption
          v-for="(option, index) in filteredOptions"
          :key="option"
          v-slot="{ isHighlighted, isSelected }"
          :value="option"
          :index="index"
        >
          <div class="option" :class="{ highlighted: isHighlighted }">
            {{ option }}<span v-if="isSelected"> ✓</span>
          </div>
        </ComboBoxOption>
        <div v-if="!filteredOptions.length" class="empty">No matching fruit.</div>
      </ComboBoxMenu>
    </ComboBox>
    <p class="output">v-model: <code>{{ JSON.stringify(fruit) }}</code></p>
  </div>
</template>

<style scoped>
.demo { margin: 1.5rem 0; max-width: 20rem; font-size: 0.95rem; }
.label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
.combobox { position: relative; }
.field {
  display: flex;
  align-items: center;
  border: 1px solid #94a3b8;
  border-radius: 6px;
  background: #fff;
  color: #0f172a;
}
.field:focus-within { outline: 2px solid #0ea5e9; outline-offset: 1px; }
.value { padding-left: 0.6rem; white-space: nowrap; }
.input {
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.6rem;
  border: 0;
  background: transparent;
  color: inherit;
  outline: none;
}
.toggle { padding: 0 0.6rem; border: 0; background: none; color: #64748b; cursor: pointer; }
.menu {
  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 14rem;
  margin-top: 4px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
}
.option { padding: 0.35rem 0.6rem; cursor: pointer; }
.option.highlighted { background: #0369a1; color: #fff; }
[aria-selected='true'] > .option { font-weight: 600; }
.empty { padding: 0.35rem 0.6rem; color: #64748b; }
.output { margin-top: 0.5rem; font-size: 0.85rem; }
</style>
