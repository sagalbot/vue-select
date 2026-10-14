import { describe, it, expect, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useComboBox } from '@/hooks/useComboBox'
import type { OptionValue } from '@/types'

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

  describe('controlled open', () => {
    it('only requests a change through update:open', async () => {
      const props = reactive<Record<string, unknown>>({ options: ['one'], open: false })
      const emit = vi.fn()
      const { open, setOpen } = useComboBox(props, emit)

      setOpen(true)
      expect(emit).toHaveBeenCalledWith('update:open', true)
      expect(open.value).toBe(false)
      expect(emit).not.toHaveBeenCalledWith('open')
    })

    it('follows the prop and emits open/close when it changes', async () => {
      const props = reactive<Record<string, unknown>>({ options: ['one'], open: false })
      const emit = vi.fn()
      const { open } = useComboBox(props, emit)

      props.open = true
      await nextTick()
      expect(open.value).toBe(true)
      expect(emit).toHaveBeenCalledWith('open')

      props.open = false
      await nextTick()
      expect(open.value).toBe(false)
      expect(emit).toHaveBeenCalledWith('close')
    })

    it('does not open when disabled', () => {
      const { open, setOpen, emit } = createComboBox({ disabled: true })
      setOpen(true)
      expect(open.value).toBe(false)
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('mapKeydown', () => {
    it('passes the handlers and the context to the prop', () => {
      const mapKeydown = vi.fn((map) => map)
      const ctx = createComboBox({ mapKeydown })
      const handlers = { Enter: () => {} }
      expect(ctx.mapKeydown(handlers)).toBe(handlers)
      expect(mapKeydown.mock.calls[0][1].select).toBe(ctx.select)
    })

    it('returns the handlers unchanged without the prop', () => {
      const handlers = { Enter: () => {} }
      expect(createComboBox().mapKeydown(handlers)).toBe(handlers)
    })
  })

  describe('clearSearchOnBlur', () => {
    it('defaults to true for single-select', () => {
      expect(createComboBox().clearSearchOnBlur.value).toBe(true)
    })

    it('defaults to false for multi-select', () => {
      expect(createComboBox({ multiple: true }).clearSearchOnBlur.value).toBe(false)
    })

    it('defaults to false when clearSearchOnSelect is false', () => {
      expect(
        createComboBox({ clearSearchOnSelect: false }).clearSearchOnBlur.value
      ).toBe(false)
    })

    it('uses the prop when set', () => {
      expect(
        createComboBox({ multiple: true, clearSearchOnBlur: true }).clearSearchOnBlur.value
      ).toBe(true)
      expect(createComboBox({ clearSearchOnBlur: false }).clearSearchOnBlur.value).toBe(false)
    })
  })

  describe('searchable', () => {
    it('defaults to true', () => {
      expect(createComboBox().searchable.value).toBe(true)
    })

    it('reflects the prop', () => {
      expect(createComboBox({ searchable: false }).searchable.value).toBe(false)
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

    it('typing opens a closed dropdown', () => {
      const { open, setSearch } = createComboBox()
      setSearch('o')
      expect(open.value).toBe(true)
    })

    it('clearing the search does not open the dropdown', () => {
      const { open, setSearch } = createComboBox()
      setSearch('')
      expect(open.value).toBe(false)
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

    it('clearSelection emits clear', () => {
      const { clearSelection, emit } = createComboBox({ modelValue: 'one' })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('clear')
    })

    it('clearSelection resets to null and emits', () => {
      const { clearSelection, emit } = createComboBox({ modelValue: 'one' })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })

    it('deselect emits null', () => {
      const { deselect, emit } = createComboBox({ modelValue: 'one' })
      deselect('one')
      expect(emit).toHaveBeenCalledWith('option:deselecting', 'one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
      expect(emit).toHaveBeenCalledWith('option:deselected', 'one')
    })

    it('deselect emits null with reduce', () => {
      const { deselect, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        modelValue: 'CA',
      })
      deselect({ label: 'Canada', code: 'CA' })
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })

    it('deselect ignores an option that is not selected', () => {
      const { deselect, emit } = createComboBox({ modelValue: 'one' })
      deselect('two')
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('selecting an already selected option', () => {
    it('deselects it with deselectFromDropdown', () => {
      const { select, emit } = createComboBox({ modelValue: 'one', deselectFromDropdown: true })
      select('one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
      expect(emit).toHaveBeenCalledWith('option:deselected', 'one')
    })

    it('does not empty the value when not clearable', () => {
      const { select, emit } = createComboBox({
        modelValue: 'one',
        deselectFromDropdown: true,
        clearable: false,
      })
      select('one')
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', expect.anything())
      expect(emit).not.toHaveBeenCalledWith('option:deselected', 'one')
    })

    it('deselects one of several in multi-select even when not clearable', () => {
      const { select, emit } = createComboBox({
        multiple: true,
        modelValue: ['one', 'two'],
        deselectFromDropdown: true,
        clearable: false,
      })
      select('one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['two'])
    })

    it('keeps the last one in multi-select when not clearable', () => {
      const { select, emit } = createComboBox({
        multiple: true,
        modelValue: ['one'],
        deselectFromDropdown: true,
        clearable: false,
      })
      select('one')
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', expect.anything())
    })

    it('leaves the value alone without deselectFromDropdown, but still closes', () => {
      const { select, setOpen, open, emit } = createComboBox({
        multiple: true,
        modelValue: ['one'],
      })
      setOpen(true)
      emit.mockClear()
      select('one')
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', expect.anything())
      expect(emit).not.toHaveBeenCalledWith('option:selected', 'one')
      expect(open.value).toBe(false)
    })

    it('is reachable from the keyboard', () => {
      const { typeAheadDown, typeAheadSelect, emit } = createComboBox({
        modelValue: 'one',
        deselectFromDropdown: true,
      })
      typeAheadDown()
      typeAheadSelect()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })
  })

  describe('without v-model', () => {
    it('tracks the selection internally', () => {
      const { select, selectedValue, emit } = createComboBox()
      select('two')
      expect(selectedValue.value).toEqual(['two'])
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'two')
    })

    it('tracks multi-select and deselect internally', () => {
      const { select, deselect, selectedValue } = createComboBox({ multiple: true })
      select('one')
      select('three')
      deselect('one')
      expect(selectedValue.value).toEqual(['three'])
    })

    it('follows v-model again once it is bound', async () => {
      const props = reactive<Record<string, unknown>>({ options: ['one', 'two'] })
      const { select, selectedValue } = useComboBox(props, vi.fn())
      select('one')
      props.modelValue = 'two'
      expect(selectedValue.value).toEqual(['two'])
    })
  })

  describe('empty values', () => {
    it('treats an empty string as no selection', () => {
      const { selectedValue, isValueEmpty } = createComboBox({ modelValue: '' })
      expect(selectedValue.value).toEqual([])
      expect(isValueEmpty.value).toBe(true)
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

    it('getOptionKey returns strings and numbers as-is', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey('hello')).toBe('hello')
      expect(getOptionKey(1)).toBe(1)
    })

    it('getOptionKey keeps 1 and "1" distinct', () => {
      const { isOptionSelected } = createComboBox({ options: [1, '1'], modelValue: 1 })
      expect(isOptionSelected(1)).toBe(true)
      expect(isOptionSelected('1')).toBe(false)
    })

    it('getOptionKey returns option.id if present', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey({ id: 42, label: 'x' })).toBe(42)
    })

    it('getOptionKey ignores object key order', () => {
      const { getOptionKey, isOptionSelected } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        modelValue: { code: 'CA', label: 'Canada' },
      })
      expect(getOptionKey({ b: 1, a: 2 })).toBe(getOptionKey({ a: 2, b: 1 }))
      expect(isOptionSelected({ label: 'Canada', code: 'CA' })).toBe(true)
    })

    it('getOptionKey still distinguishes objects with different values', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey({ a: 1, b: 2 })).not.toBe(getOptionKey({ a: 2, b: 1 }))
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

  describe('hideSelected', () => {
    it('removes selected options from the list in multi-select', () => {
      const { filteredOptions } = createComboBox({
        multiple: true,
        hideSelected: true,
        modelValue: ['two'],
      })
      expect(filteredOptions.value).toEqual(['one', 'three'])
    })

    it('works with reduced values', () => {
      const { filteredOptions } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        multiple: true,
        hideSelected: true,
        modelValue: ['US'],
      })
      expect(filteredOptions.value).toEqual([{ label: 'Canada', code: 'CA' }])
    })

    it('has no effect in single-select', () => {
      const { filteredOptions } = createComboBox({ hideSelected: true, modelValue: 'two' })
      expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
    })

    it('shows selected options by default', () => {
      const { filteredOptions } = createComboBox({ multiple: true, modelValue: ['two'] })
      expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
    })
  })

  describe('groupBy', () => {
    // Deliberately interleaved so group order differs from options order.
    const fruit = [
      { label: 'Banana', type: 'tropical' },
      { label: 'Apple', type: 'orchard' },
      { label: 'Mango', type: 'tropical' },
      { label: 'Lemon' },
      { label: 'Pear', type: 'orchard' },
    ]
    const groupBy = (o: OptionValue) => (o as { type?: string }).type
    const labels = (opts: OptionValue[]) => opts.map((o) => (o as { label: string }).label)

    it('is one ungrouped group without groupBy', () => {
      const { groupedOptions } = createComboBox({ options: ['a', 'b'] })
      expect(groupedOptions.value).toEqual([
        { label: null, options: [{ option: 'a', index: 0 }, { option: 'b', index: 1 }] },
      ])
    })

    it('puts ungrouped options first, then groups in order of first appearance', () => {
      const { groupedOptions } = createComboBox({ options: fruit, groupBy })
      expect(
        groupedOptions.value.map((g) => [g.label, labels(g.options.map((o) => o.option))])
      ).toEqual([
        [null, ['Lemon']],
        ['tropical', ['Banana', 'Mango']],
        ['orchard', ['Apple', 'Pear']],
      ])
    })

    it('numbers options in rendered order and reorders filteredOptions to match', () => {
      const { groupedOptions, filteredOptions } = createComboBox({ options: fruit, groupBy })
      const flat = groupedOptions.value.flatMap((g) => g.options)
      expect(flat.map((o) => o.index)).toEqual([0, 1, 2, 3, 4])
      expect(labels(filteredOptions.value)).toEqual(['Lemon', 'Banana', 'Mango', 'Apple', 'Pear'])
    })

    it('keyboard navigation follows group order', () => {
      const { typeAheadDown, typeAheadSelect, emit } = createComboBox({ options: fruit, groupBy })
      typeAheadDown()
      typeAheadDown()
      typeAheadDown()
      typeAheadDown()
      typeAheadSelect()
      // Fourth in group order (Lemon, Banana, Mango, Apple); Lemon in options order
      expect(emit).toHaveBeenCalledWith('update:modelValue', fruit[1])
    })

    it('hides groups with no matching options', () => {
      const { groupedOptions, setSearch } = createComboBox({ options: fruit, groupBy })
      setSearch('an')
      expect(groupedOptions.value.map((g) => g.label)).toEqual(['tropical'])
      expect(labels(groupedOptions.value[0].options.map((o) => o.option))).toEqual([
        'Banana',
        'Mango',
      ])
    })

    it('is empty when nothing matches', () => {
      const { groupedOptions, setSearch } = createComboBox({ options: fruit, groupBy })
      setSearch('zzz')
      expect(groupedOptions.value).toEqual([])
    })

    it('keeps a new tag ungrouped at the top', () => {
      const { groupedOptions, setSearch } = createComboBox({
        options: ['apple', 'avocado'],
        taggable: true,
        groupBy: (o: OptionValue) => String(o)[0],
      })
      setSearch('apricot')
      expect(groupedOptions.value[0]).toEqual({
        label: null,
        options: [{ option: 'apricot', index: 0 }],
      })
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
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
      })
      select({ label: 'Canada', code: 'CA' })
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'CA')
    })

    it('selectedValue still contains the full option objects', () => {
      const { selectedValue } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        modelValue: 'CA',
      })
      expect(selectedValue.value).toEqual([{ label: 'Canada', code: 'CA' }])
    })

    it('handles reduced multi-select values', () => {
      const { selectedValue } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
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
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        modelValue: 'CA',
      })
      expect(isOptionSelected({ label: 'Canada', code: 'CA' })).toBe(true)
    })

    it('deselect works with reduced values in multi mode', () => {
      const { deselect, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        multiple: true,
        modelValue: ['CA', 'US'],
      })
      deselect({ label: 'Canada', code: 'CA' })
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['US'])
    })

    it('keeps the selected option after it leaves options', () => {
      const canada = { label: 'Canada', code: 'CA' }
      const props = reactive<Record<string, unknown>>({
        options: [canada, { label: 'USA', code: 'US' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        modelValue: 'CA',
      })
      const ctx = useComboBox(props, vi.fn())
      expect(ctx.getOptionLabel(ctx.selectedValue.value[0])).toBe('Canada')

      // e.g. an AJAX search replaced the options
      props.options = [{ label: 'Mexico', code: 'MX' }]
      expect(ctx.selectedValue.value).toEqual([canada])
    })

    it('keeps an option selected through the dropdown after options change', () => {
      const mexico = { label: 'Mexico', code: 'MX' }
      const props = reactive<Record<string, unknown>>({
        options: [mexico],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        multiple: true,
        modelValue: [],
      })
      const ctx = useComboBox(props, (event: string, value: unknown) => {
        if (event === 'update:modelValue') props.modelValue = value
      })
      ctx.select(mexico)
      props.options = []
      expect(ctx.selectedValue.value).toEqual([mexico])
    })

    it('falls back to the reduced value when the option was never seen', () => {
      const ctx = useComboBox(
        reactive({
          options: [],
          reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
          modelValue: 'CA',
        }),
        vi.fn()
      )
      expect(ctx.selectedValue.value).toEqual(['CA'])
    })

    it('clearSelection emits null (single) or empty array (multi) with reduce', () => {
      const { clearSelection, emit } = createComboBox({
        options: [{ label: 'Canada', code: 'CA' }],
        reduce: (opt: OptionValue) => (opt as Record<string, unknown>).code,
        modelValue: 'CA',
      })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })
  })

  describe('resetOnOptionsChange', () => {
    function setup(overrides: Record<string, unknown>) {
      const props = reactive<Record<string, unknown>>({
        options: ['one', 'two'],
        modelValue: 'one',
        ...overrides,
      })
      const emit = vi.fn()
      return { props, emit, ctx: useComboBox(props, emit) }
    }

    it('keeps the value when options change by default', async () => {
      const { props, emit } = setup({})
      props.options = ['three']
      await nextTick()
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', null)
    })

    it('clears the value when true', async () => {
      const { props, emit } = setup({ resetOnOptionsChange: true })
      props.options = ['three']
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
      // clear is for the user clearing, not for resets
      expect(emit).not.toHaveBeenCalledWith('clear')
    })

    it('clears to an empty array in multi-select', async () => {
      const { props, emit } = setup({
        resetOnOptionsChange: true,
        multiple: true,
        modelValue: ['one'],
      })
      props.options = ['three']
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:modelValue', [])
    })

    it('passes new options, old options and the selection to a function', async () => {
      const resetOnOptionsChange = vi.fn(() => false)
      const { props, emit } = setup({ resetOnOptionsChange })
      props.options = ['three']
      await nextTick()
      expect(resetOnOptionsChange).toHaveBeenCalledWith(['three'], ['one', 'two'], ['one'])
      expect(emit).not.toHaveBeenCalledWith('update:modelValue', null)
    })

    it('clears the value when the function returns true', async () => {
      const { props, emit } = setup({ resetOnOptionsChange: () => true })
      props.options = ['three']
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })

    it('never clears when taggable', async () => {
      const { props, emit } = setup({ resetOnOptionsChange: true, taggable: true })
      props.options = ['three']
      await nextTick()
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('tagging', () => {
    it('select creates a new option from search text when taggable', () => {
      const { select, setSearch, emit } = createComboBox({
        options: ['one', 'two'],
        taggable: true,
      })
      setSearch('new-tag')
      select('new-tag')
      expect(emit).toHaveBeenCalledWith('option:created', 'new-tag')
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'new-tag')
    })


    it('creates an object with the label key when options are objects', () => {
      const { filteredOptions, setSearch } = createComboBox({
        options: [{ name: 'Canada' }],
        label: 'name',
        taggable: true,
      })
      setSearch('Mexico')
      expect(filteredOptions.value[0]).toEqual({ name: 'Mexico' })
    })

    it('uses custom createOption when provided', () => {
      const { select, setSearch, emit } = createComboBox({
        options: [],
        taggable: true,
        label: 'label',
        createOption: (search: string) => ({ label: search, custom: true }),
      })
      setSearch('new')
      select({ label: 'new', custom: true })
      expect(emit).toHaveBeenCalledWith('option:created', { label: 'new', custom: true })
    })
  })

  describe('loading', () => {
    it('isLoading reflects the loading prop', () => {
      const { isLoading } = createComboBox({ loading: true })
      expect(isLoading.value).toBe(true)
    })

    it('toggleLoading flips the internal loading state', () => {
      const { isLoading, toggleLoading } = createComboBox()
      expect(isLoading.value).toBe(false)
      toggleLoading(true)
      expect(isLoading.value).toBe(true)
    })

    it('emits search event when search changes', () => {
      const { setSearch, emit } = createComboBox()
      setSearch('hello')
      expect(emit).toHaveBeenCalledWith('search', 'hello', expect.any(Function))
    })
  })

})
