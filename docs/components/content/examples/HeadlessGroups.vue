<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxMenu,
  ComboBoxGroup,
  ComboBoxOption,
} from '@/index'

const foods = [
  { id: 1, name: 'Apple', type: 'Fruit' },
  { id: 2, name: 'Broccoli', type: 'Vegetable' },
  { id: 3, name: 'Banana', type: 'Fruit' },
  { id: 4, name: 'Carrot', type: 'Vegetable' },
  { id: 5, name: 'Cheddar', type: 'Dairy' },
  { id: 6, name: 'Cherry', type: 'Fruit' },
  { id: 7, name: 'Spinach', type: 'Vegetable' },
  { id: 8, name: 'Yogurt', type: 'Dairy' },
  { id: 9, name: 'Surprise me', type: null },
]
const food = ref(null)
</script>

<template>
  <div class="demo not-prose">
    <label for="headless-groups-input" class="label">Food</label>
    <ComboBox
      v-slot="{ selected, search, groupedOptions }"
      v-model="food"
      :options="foods"
      label="name"
      :group-by="(option) => option.type"
      class="combobox"
    >
      <div class="field">
        <span v-if="selected.length && !search" class="value">{{ selected[0].name }}</span>
        <ComboBoxInput id="headless-groups-input" class="input" />
        <ComboBoxButton class="toggle" aria-label="Show foods">▾</ComboBoxButton>
      </div>

      <ComboBoxMenu class="menu">
        <template v-for="group in groupedOptions" :key="group.label ?? ''">
          <ComboBoxGroup v-if="group.label" :label="group.label">
            <template #label="{ label }">
              <div class="group-label">{{ label }}</div>
            </template>
            <ComboBoxOption
              v-for="{ option, index } in group.options"
              :key="option.id"
              v-slot="{ isHighlighted }"
              :value="option"
              :index="index"
            >
              <div class="option" :class="{ highlighted: isHighlighted }">{{ option.name }}</div>
            </ComboBoxOption>
          </ComboBoxGroup>
          <!-- options without a group (label: null) come first, with no header -->
          <template v-else>
            <ComboBoxOption
              v-for="{ option, index } in group.options"
              :key="option.id"
              v-slot="{ isHighlighted }"
              :value="option"
              :index="index"
            >
              <div class="option" :class="{ highlighted: isHighlighted }">{{ option.name }}</div>
            </ComboBoxOption>
          </template>
        </template>
        <div v-if="!groupedOptions.length" class="empty">No matches.</div>
      </ComboBoxMenu>
    </ComboBox>
    <p class="output">v-model: <code>{{ JSON.stringify(food) }}</code></p>
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
  max-height: 16rem;
  margin-top: 4px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
}
.group-label {
  padding: 0.5rem 0.6rem 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
}
.option { padding: 0.35rem 0.6rem 0.35rem 1.2rem; cursor: pointer; }
.option.highlighted { background: #0369a1; color: #fff; }
.empty { padding: 0.35rem 0.6rem; color: #64748b; }
.output { margin-top: 0.5rem; font-size: 0.85rem; }
</style>
