<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxClear,
  ComboBoxMenu,
  ComboBoxOption,
} from '@/index'

const languages = ['CSS', 'Go', 'HTML', 'JavaScript', 'Kotlin', 'PHP', 'Python', 'Ruby', 'Rust', 'Swift', 'TypeScript']
const picked = ref(['JavaScript', 'TypeScript'])

function remove(language) {
  picked.value = picked.value.filter((l) => l !== language)
}
</script>

<template>
  <div class="demo not-prose">
    <label for="headless-multiple-input" class="label">Languages</label>
    <ComboBox
      v-slot="{ selected, filteredOptions }"
      v-model="picked"
      :options="languages"
      multiple
      hide-selected
      :close-on-select="false"
      class="combobox"
    >
      <div class="field">
        <span v-for="language in selected" :key="language" class="tag">
          {{ language }}
          <button
            type="button"
            class="tag-remove"
            :aria-label="`Remove ${language}`"
            @click="remove(language)"
          >
            ×
          </button>
        </span>
        <ComboBoxInput id="headless-multiple-input" class="input" />
        <ComboBoxClear class="icon-button">Clear</ComboBoxClear>
        <ComboBoxButton class="icon-button" aria-label="Show languages">▾</ComboBoxButton>
      </div>

      <ComboBoxMenu class="menu">
        <ComboBoxOption
          v-for="(option, index) in filteredOptions"
          :key="option"
          v-slot="{ isHighlighted }"
          :value="option"
          :index="index"
        >
          <div class="option" :class="{ highlighted: isHighlighted }">{{ option }}</div>
        </ComboBoxOption>
        <div v-if="!filteredOptions.length" class="empty">Nothing left to pick.</div>
      </ComboBoxMenu>
    </ComboBox>
    <p class="output">v-model: <code>{{ JSON.stringify(picked) }}</code></p>
  </div>
</template>

<style scoped>
.demo { margin: 1.5rem 0; max-width: 28rem; font-size: 0.95rem; }
.label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
.combobox { position: relative; }
.field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid #94a3b8;
  border-radius: 6px;
  background: #fff;
  color: #0f172a;
}
.field:focus-within { outline: 2px solid #0ea5e9; outline-offset: 1px; }
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.25rem 0.1rem 0.5rem;
  border-radius: 4px;
  background: #e0f2fe;
  color: #075985;
}
.tag-remove { border: 0; background: none; color: inherit; cursor: pointer; }
.input {
  flex: 1;
  min-width: 6rem;
  padding: 0.25rem;
  border: 0;
  background: transparent;
  color: inherit;
  outline: none;
}
.icon-button { padding: 0 0.4rem; border: 0; background: none; color: #64748b; cursor: pointer; font-size: 0.85rem; }
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
.empty { padding: 0.35rem 0.6rem; color: #64748b; }
.output { margin-top: 0.5rem; font-size: 0.85rem; }
</style>
