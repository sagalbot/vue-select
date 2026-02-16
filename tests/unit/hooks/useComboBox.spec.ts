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

  describe('filtering', () => {
    it('filteredOptions returns all options when search is empty', () => {
      const { filteredOptions } = createComboBox({ options: ['one', 'two', 'three'] })
      expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
    })

    it('filteredOptions filters by search text (case-insensitive)', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: ['One', 'Two', 'Three'],
      })
      setSearch('tw')
      expect(filteredOptions.value).toEqual(['Two'])
    })

    it('does not filter when filterable is false', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: ['one', 'two', 'three'],
        filterable: false,
      })
      setSearch('tw')
      expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
    })

    it('uses custom filter function when provided', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: ['one', 'two', 'three'],
        filter: (opts: string[], search: string) => opts.filter((o) => o === search),
      })
      setSearch('two')
      expect(filteredOptions.value).toEqual(['two'])
    })

    it('uses custom filterBy when provided', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: [{ label: 'one', code: '1' }, { label: 'two', code: '2' }],
        label: 'label',
        filterBy: (option: any, label: string, search: string) => option.code.includes(search),
      })
      setSearch('2')
      expect(filteredOptions.value).toEqual([{ label: 'two', code: '2' }])
    })

    it('filteredOptions includes taggable option when taggable and search has no match', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: ['one', 'two'],
        taggable: true,
      })
      setSearch('new-tag')
      expect(filteredOptions.value).toContain('new-tag')
    })

    it('filteredOptions does not include duplicate tag when option already exists', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: ['one', 'two'],
        taggable: true,
      })
      setSearch('one')
      const count = filteredOptions.value.filter((o) => o === 'one').length
      expect(count).toBe(1)
    })
  })

  describe('typeAheadPointer', () => {
    it('starts at -1', () => {
      const { typeAheadPointer } = createComboBox()
      expect(typeAheadPointer.value).toBe(-1)
    })

    it('typeAheadDown moves to the next selectable option', () => {
      const { typeAheadPointer, typeAheadDown } = createComboBox({
        options: ['one', 'two', 'three'],
      })
      typeAheadDown()
      expect(typeAheadPointer.value).toBe(0)
      typeAheadDown()
      expect(typeAheadPointer.value).toBe(1)
    })

    it('typeAheadDown wraps to beginning', () => {
      const { typeAheadPointer, typeAheadDown } = createComboBox({
        options: ['one', 'two'],
      })
      typeAheadDown() // 0
      typeAheadDown() // 1
      typeAheadDown() // wraps to 0
      expect(typeAheadPointer.value).toBe(0)
    })

    it('typeAheadDown skips non-selectable options', () => {
      const { typeAheadPointer, typeAheadDown } = createComboBox({
        options: ['one', 'two', 'three'],
        selectable: (opt: string) => opt !== 'two',
      })
      typeAheadDown() // 0 (one)
      typeAheadDown() // skips 1 (two), lands on 2 (three)
      expect(typeAheadPointer.value).toBe(2)
    })

    it('typeAheadUp moves to the previous selectable option', () => {
      const { typeAheadPointer, typeAheadDown, typeAheadUp } = createComboBox({
        options: ['one', 'two', 'three'],
      })
      typeAheadDown() // 0
      typeAheadDown() // 1
      typeAheadUp()   // 0
      expect(typeAheadPointer.value).toBe(0)
    })

    it('typeAheadUp wraps to end', () => {
      const { typeAheadPointer, typeAheadUp } = createComboBox({
        options: ['one', 'two', 'three'],
      })
      typeAheadUp() // wraps to 2
      expect(typeAheadPointer.value).toBe(2)
    })

    it('typeAheadSelect selects the highlighted option', () => {
      const { typeAheadDown, typeAheadSelect, emit } = createComboBox({
        options: ['one', 'two'],
      })
      typeAheadDown() // highlight 'one'
      typeAheadSelect()
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'one')
    })

    it('typeAheadSelect does nothing when pointer is -1', () => {
      const { typeAheadSelect, emit } = createComboBox({
        options: ['one', 'two'],
      })
      typeAheadSelect()
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', expect.anything())
    })

    it('isOptionHighlighted returns true for the highlighted index', () => {
      const { typeAheadDown, isOptionHighlighted } = createComboBox({
        options: ['one', 'two'],
      })
      typeAheadDown()
      expect(isOptionHighlighted(0)).toBe(true)
      expect(isOptionHighlighted(1)).toBe(false)
    })
  })

  describe('reduce', () => {
    it('emits the reduced value on select', () => {
      const { select, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        reduce: (opt: any) => opt.code,
      })
      select({ label: 'Canada', code: 'CA' })
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'CA')
    })

    it('selectedValue still contains the full option objects', () => {
      const { selectedValue } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: any) => opt.code,
        modelValue: 'CA',
      })
      expect(selectedValue.value).toEqual([{ label: 'Canada', code: 'CA' }])
    })

    it('handles reduced multi-select values', () => {
      const { selectedValue } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: any) => opt.code,
        multiple: true,
        modelValue: ['CA', 'US'],
      })
      expect(selectedValue.value).toEqual([
        { label: 'Canada', code: 'CA' },
        { label: 'USA', code: 'US' },
      ])
    })

    it('isOptionSelected works with reduced values', () => {
      const { isOptionSelected } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        reduce: (opt: any) => opt.code,
        modelValue: 'CA',
      })
      expect(isOptionSelected({ label: 'Canada', code: 'CA' })).toBe(true)
    })

    it('deselect works with reduced values in multi mode', () => {
      const { deselect, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: any) => opt.code,
        multiple: true,
        modelValue: ['CA', 'US'],
      })
      deselect({ label: 'Canada', code: 'CA' })
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['US'])
    })

    it('clearSelection emits null (single) or empty array (multi) with reduce', () => {
      const { clearSelection, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        reduce: (opt: any) => opt.code,
        modelValue: 'CA',
      })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })
  })

})
