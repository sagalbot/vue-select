<script setup>
import { reactive, ref } from 'vue'
import { useComboBox } from '@/index'

const colors = [
  { name: 'Crimson', hex: '#dc143c' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Steel Blue', hex: '#4682b4' },
  { name: 'Indigo', hex: '#4b0082' },
  { name: 'Orchid', hex: '#da70d6' },
]
const color = ref(null)

// useComboBox(props, emit): props must be reactive. The ref is unwrapped, so
// the combobox reads `color.value` and asks for changes through the emit.
const {
  open,
  search,
  selectedValue,
  filteredOptions,
  typeAheadPointer,
  uid,
  setOpen,
  toggleOpen,
  setSearch,
  select,
  typeAheadUp,
  typeAheadDown,
  typeAheadFirst,
  typeAheadLast,
  typeAheadSelect,
  isOptionSelected,
} = useComboBox(
  reactive({ options: colors, label: 'name', modelValue: color }),
  (event, value) => {
    if (event === 'update:modelValue') color.value = value
  }
)

const inputEl = ref(null)
const listboxId = `color-${uid.value}-listbox`
const optionId = (index) => `color-${uid.value}-option-${index}`

function onKeydown(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      e.preventDefault()
      const down = e.key === 'ArrowDown'
      if (open.value) return down ? typeAheadDown() : typeAheadUp()
      setOpen(true)
      if (typeAheadPointer.value === -1) down ? typeAheadFirst() : typeAheadLast()
      return
    }
    case 'Enter':
      if (!open.value) return
      e.preventDefault()
      return typeAheadSelect()
    case 'Escape':
      return open.value ? setOpen(false) : setSearch('')
  }
}

function onBlur() {
  setOpen(false)
  setSearch('')
}
</script>

<template>
  <div class="demo not-prose">
    <label :for="`color-${uid}-input`" class="label">Color</label>
    <div class="picker">
      <div class="field">
        <span
          class="swatch"
          :style="{ background: selectedValue[0]?.hex ?? 'transparent' }"
          aria-hidden="true"
        />
        <input
          :id="`color-${uid}-input`"
          ref="inputEl"
          class="input"
          type="text"
          role="combobox"
          autocomplete="off"
          aria-autocomplete="list"
          :aria-expanded="open"
          :aria-controls="listboxId"
          :aria-activedescendant="open && typeAheadPointer > -1 ? optionId(typeAheadPointer) : undefined"
          :placeholder="selectedValue[0]?.name ?? 'Search colors'"
          :value="search"
          @input="setSearch($event.target.value)"
          @keydown="onKeydown"
          @blur="onBlur"
        />
        <button
          type="button"
          class="toggle"
          tabindex="-1"
          aria-label="Show colors"
          :aria-expanded="open"
          :aria-controls="listboxId"
          @mousedown.prevent
          @click="toggleOpen(), inputEl.focus()"
        >
          ▾
        </button>
      </div>

      <ul v-show="open" :id="listboxId" role="listbox" class="listbox" @mousedown.prevent>
        <li
          v-for="(option, index) in filteredOptions"
          :id="optionId(index)"
          :key="option.hex"
          role="option"
          :aria-selected="isOptionSelected(option)"
          :class="{ highlighted: typeAheadPointer === index }"
          @mousemove="typeAheadPointer = index"
          @click="select(option)"
        >
          <span class="swatch" :style="{ background: option.hex }" aria-hidden="true" />
          {{ option.name }}
        </li>
        <li v-if="!filteredOptions.length" class="empty">No matching color.</li>
      </ul>
    </div>
    <p class="output">v-model: <code>{{ JSON.stringify(color) }}</code></p>
  </div>
</template>

<style scoped>
.demo { margin: 1.5rem 0; max-width: 20rem; font-size: 0.95rem; }
.label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
.picker { position: relative; }
.field {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-left: 0.6rem;
  border: 1px solid #94a3b8;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
}
.field:focus-within { outline: 2px solid #0ea5e9; outline-offset: 1px; }
.input {
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0;
  border: 0;
  background: transparent;
  color: inherit;
  outline: none;
}
.input::placeholder { color: #334155; }
.toggle { padding: 0 0.8rem; border: 0; background: none; color: #64748b; cursor: pointer; }
.swatch {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 999px;
  border: 1px solid rgb(0 0 0 / 0.15);
}
.listbox {
  position: absolute;
  z-index: 10;
  width: 100%;
  margin: 4px 0 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
}
[role='option'] {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  cursor: pointer;
}
[role='option'].highlighted { background: #e0f2fe; }
[role='option'][aria-selected='true'] { font-weight: 600; }
.empty { padding: 0.35rem 0.6rem; color: #64748b; }
.output { margin-top: 0.5rem; font-size: 0.85rem; }
</style>
