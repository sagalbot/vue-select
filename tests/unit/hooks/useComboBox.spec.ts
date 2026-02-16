import { describe, it, expect, vi } from 'vitest'
import { useComboBox } from '@/hooks/useComboBox'

function createComboBox(overrides = {}) {
  const emit = vi.fn()
  const props = {
    options: ['one', 'two', 'three'],
    ...overrides,
  }
  return { ...useComboBox(props, emit), emit }
}

describe('useComboBox', () => {
  describe('open state', () => {
    it('starts closed by default', () => {
      const { open } = createComboBox()
      expect(open.value).toBe(false)
    })

    it('toggleOpen flips the state', () => {
      const { open, toggleOpen } = createComboBox()
      toggleOpen()
      expect(open.value).toBe(true)
      toggleOpen()
      expect(open.value).toBe(false)
    })

    it('setOpen sets the state directly', () => {
      const { open, setOpen } = createComboBox()
      setOpen(true)
      expect(open.value).toBe(true)
      setOpen(false)
      expect(open.value).toBe(false)
    })

    it('emits open/close events', () => {
      const { toggleOpen, emit } = createComboBox()
      toggleOpen()
      expect(emit).toHaveBeenCalledWith('open')
      toggleOpen()
      expect(emit).toHaveBeenCalledWith('close')
    })
  })

  describe('search state', () => {
    it('starts with empty search', () => {
      const { search } = createComboBox()
      expect(search.value).toBe('')
    })

    it('setSearch updates search text', () => {
      const { search, setSearch } = createComboBox()
      setSearch('hello')
      expect(search.value).toBe('hello')
    })

    it('isSearching reflects search state', () => {
      const { isSearching, setSearch } = createComboBox()
      expect(isSearching.value).toBe(false)
      setSearch('hello')
      expect(isSearching.value).toBe(true)
    })
  })

  describe('selection - single', () => {
    it('starts with empty selection when no modelValue', () => {
      const { selectedValue, isValueEmpty } = createComboBox()
      expect(selectedValue.value).toEqual([])
      expect(isValueEmpty.value).toBe(true)
    })

    it('select sets the value and emits update:modelValue', () => {
      const { select, emit } = createComboBox()
      select('one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'one')
    })

    it('select emits option:selecting and option:selected events', () => {
      const { select, emit } = createComboBox()
      select('one')
      expect(emit).toHaveBeenCalledWith('option:selecting', 'one')
      expect(emit).toHaveBeenCalledWith('option:selected', 'one')
    })

    it('clearSelection resets to null and emits', () => {
      const { clearSelection, emit } = createComboBox({ modelValue: 'one' })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })
  })

  describe('selection - multiple', () => {
    it('select appends to existing values', () => {
      const { select, emit } = createComboBox({
        multiple: true,
        modelValue: ['one'],
      })
      select('two')
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['one', 'two'])
    })

    it('deselect removes from existing values', () => {
      const { deselect, emit } = createComboBox({
        multiple: true,
        modelValue: ['one', 'two'],
      })
      deselect('one')
      expect(emit).toHaveBeenCalledWith('option:deselecting', 'one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['two'])
      expect(emit).toHaveBeenCalledWith('option:deselected', 'one')
    })

    it('clearSelection resets to empty array', () => {
      const { clearSelection, emit } = createComboBox({
        multiple: true,
        modelValue: ['one', 'two'],
      })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', [])
    })
  })

  describe('option helpers', () => {
    it('getOptionLabel returns the option for strings', () => {
      const { getOptionLabel } = createComboBox()
      expect(getOptionLabel('hello')).toBe('hello')
    })

    it('getOptionLabel returns option[label] for objects', () => {
      const { getOptionLabel } = createComboBox({ label: 'name' })
      expect(getOptionLabel({ name: 'Canada' })).toBe('Canada')
    })

    it('getOptionKey returns JSON.stringify by default', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey('hello')).toBe(JSON.stringify('hello'))
    })

    it('getOptionKey returns option.id if present', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey({ id: 42, label: 'x' })).toBe('42')
    })

    it('isOptionSelected returns true for selected options', () => {
      const { isOptionSelected } = createComboBox({ modelValue: 'one' })
      expect(isOptionSelected('one')).toBe(true)
      expect(isOptionSelected('two')).toBe(false)
    })

    it('isOptionSelectable defaults to true', () => {
      const { isOptionSelectable } = createComboBox()
      expect(isOptionSelectable('one')).toBe(true)
    })

    it('isOptionSelectable respects selectable prop', () => {
      const { isOptionSelectable } = createComboBox({
        selectable: (opt: string) => opt !== 'two',
      })
      expect(isOptionSelectable('one')).toBe(true)
      expect(isOptionSelectable('two')).toBe(false)
    })
  })
})
