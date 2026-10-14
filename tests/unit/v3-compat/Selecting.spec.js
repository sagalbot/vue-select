import { it, describe, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import {
  mountDefault,
  selectWithProps,
  searchFocus,
  pressKey,
  openDropdown,
  dropdownOptions,
  dropdownOptionLabels,
  selectedLabels,
  lastEmittedValue,
} from './helpers.js'

/** Mount with `modelValue` kept in sync with update:modelValue, like v-model. */
const mountWithVModel = (props) => {
  const wrapper = selectWithProps({
    ...props,
    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
  })
  return wrapper
}

/** Whether the selection is empty, as the user sees it. */
const isValueEmpty = (wrapper) => wrapper.findAll('.vs__selected').length === 0

const isOptionSelected = (option) =>
  option.classes().includes('vs__dropdown-option--selected') &&
  option.attributes('aria-selected') === 'true'

describe('VS - Selecting Values', () => {
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      modelValue: 'one',
      options: ['one', 'two', 'three'],
    }
  })

  it('can accept an array with pre-selected values', () => {
    const Select = mount(VueSelect, {
      props: defaultProps,
    })
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('can accept an array of objects and pre-selected value (single)', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: { label: 'This is Foo', value: 'foo' },
        options: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
        ],
      },
    })
    expect(selectedLabels(Select)).toEqual(['This is Foo'])

    await openDropdown(Select)
    expect(dropdownOptions(Select).map(isOptionSelected)).toEqual([true, false])
  })

  it('can accept an array of objects and pre-selected values (multiple)', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
        ],
        options: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
        ],
        multiple: true,
      },
    })

    expect(selectedLabels(Select)).toEqual(['This is Foo', 'This is Bar'])

    await openDropdown(Select)
    expect(dropdownOptions(Select).map(isOptionSelected)).toEqual([true, true])
  })

  it('can select an option on tab', async () => {
    // v3 selectOnTab -> v4 mapKeydown mapping Tab to Enter
    const Select = mountDefault({
      mapKeydown: (map) => ({ ...map, Tab: map.Enter }),
    })

    await searchFocus(Select)
    await pressKey(Select, 'ArrowDown')
    await pressKey(Select, 'Tab')

    expect(lastEmittedValue(Select)).toEqual('one')
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('can deselect a pre-selected object', async () => {
    const Select = mountWithVModel({
      multiple: true,
      options: [
        { label: 'This is Foo', value: 'foo' },
        { label: 'This is Bar', value: 'bar' },
      ],
      modelValue: [
        { label: 'This is Foo', value: 'foo' },
        { label: 'This is Bar', value: 'bar' },
      ],
    })

    Select.vm.deselect({ label: 'This is Foo', value: 'foo' })
    await nextTick()

    expect(lastEmittedValue(Select)).toEqual([
      { label: 'This is Bar', value: 'bar' },
    ])
    expect(selectedLabels(Select)).toEqual(['This is Bar'])
  })

  it('can deselect a pre-selected string', async () => {
    const Select = mountWithVModel({
      multiple: true,
      options: ['foo', 'bar'],
      modelValue: 'foo',
    })

    Select.vm.deselect('foo')
    await nextTick()

    expect(lastEmittedValue(Select)).toEqual([])
    expect(selectedLabels(Select)).toEqual([])
  })

  it('can deselect an option when multiple is false', async () => {
    const Select = mountWithVModel({ modelValue: 'foo' })

    Select.vm.deselect('foo')
    await nextTick()

    // Known v4 change: single-select deselect emits null (v3 emitted []).
    expect(lastEmittedValue(Select)).toEqual(null)
    expect(selectedLabels(Select)).toEqual([])
  })

  it('can determine if the value prop is empty', async () => {
    const Select = mount(VueSelect, {
      props: {
        options: ['one', 'two', 'three'],
      },
    })

    const select = Select.vm
    expect(isValueEmpty(Select)).toEqual(true)

    select.select(['one'])
    await nextTick()
    expect(isValueEmpty(Select)).toEqual(false)

    select.select('one')
    await nextTick()
    expect(isValueEmpty(Select)).toEqual(false)

    select.select({ label: 'foo', value: 'foo' })
    await nextTick()
    expect(isValueEmpty(Select)).toEqual(false)

    select.select('')
    await nextTick()
    expect(isValueEmpty(Select)).toEqual(true)

    select.select(null)
    await nextTick()
    expect(isValueEmpty(Select)).toEqual(true)
  })

  it('should reset the selected values when the multiple property changes', async () => {
    const Select = mount(VueSelect, {
      props: {
        multiple: true,
        options: ['one', 'two', 'three'],
      },
    })

    await Select.setProps({ multiple: false })
    expect(selectedLabels(Select)).toEqual([])

    await Select.setProps({ multiple: true })
    expect(selectedLabels(Select)).toEqual([])
  })

  it('can retain values present in a new array of options', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: ['one'],
        options: ['one', 'two', 'three'],
      },
    })

    await Select.setProps({ options: ['one', 'five', 'six'] })
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('can determine if an object is already selected', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: [{ label: 'one' }],
        options: [{ label: 'one' }],
      },
    })

    await openDropdown(Select)
    expect(isOptionSelected(dropdownOptions(Select)[0])).toEqual(true)
  })

  it('can use v-model syntax for a two way binding to a parent component', async () => {
    const Parent = mount({
      data: () => ({ value: 'foo', options: ['foo', 'bar', 'baz'] }),
      template: `<div><v-select :options="options" v-model="value" /></div>`,
      components: { 'v-select': VueSelect },
    })
    const Select = Parent.getComponent(VueSelect)

    expect(Select.props('modelValue')).toEqual('foo')
    expect(selectedLabels(Select)).toEqual(['foo'])

    await searchFocus(Select)
    await dropdownOptions(Select)[1].trigger('click')

    expect(Parent.vm.value).toEqual('bar')
    expect(selectedLabels(Select)).toEqual(['bar'])
  })

  it('can check if a string value is selected when the value is an object and multiple is true', () => {
    const Select = mount(VueSelect, {
      props: {
        multiple: true,
        modelValue: [{ label: 'foo', value: 'bar' }],
      },
    })

    // Selecting an already-selected option changes nothing...
    Select.vm.select({ label: 'foo', value: 'bar' })
    expect(Select.emitted('update:modelValue')).toBeUndefined()

    // ...and deselecting it works, which only happens for selected options.
    Select.vm.deselect({ label: 'foo', value: 'bar' })
    expect(Select.emitted('option:deselected')).toEqual([
      [{ label: 'foo', value: 'bar' }],
    ])
    expect(lastEmittedValue(Select)).toEqual([])
  })

  it('can select two options with the same label', async () => {
    const options = [
      { label: 'one', id: 1 },
      { label: 'one', id: 2 },
    ]
    const Select = mountDefault({ options, multiple: true })

    await openDropdown(Select)
    await dropdownOptions(Select)[0].trigger('click')
    await openDropdown(Select)
    await dropdownOptions(Select)[1].trigger('click')

    expect(lastEmittedValue(Select)).toEqual(options)
    expect(selectedLabels(Select)).toEqual(['one', 'one'])
  })

  it('can select a false boolean option', async () => {
    const Select = mountDefault({
      options: [false],
    })

    await openDropdown(Select)
    expect(dropdownOptionLabels(Select)).toEqual(['false'])
    expect(isOptionSelected(dropdownOptions(Select)[0])).toBeFalsy()

    await Select.find('.vs__dropdown-option').trigger('click')

    expect(Select.emitted('update:modelValue')).toEqual([[false]])
    expect(selectedLabels(Select)).toEqual(['false'])
  })

  describe('input Event', () => {
    it('will trigger the input event when the selection changes', () => {
      const Select = mount(VueSelect)
      Select.vm.select('bar')
      expect(Select.emitted('update:modelValue')[0]).toEqual(['bar'])
    })

    it('will trigger the input event when the selection changes and multiple is true', () => {
      const Select = mount(VueSelect, {
        props: { multiple: true, modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.select('bar')
      expect(Select.emitted('update:modelValue')[0]).toEqual([['foo', 'bar']])
    })

    it('will not trigger the input event when multiple is true and selection is repeated', () => {
      const Select = mount(VueSelect, {
        props: {
          multiple: true,
          modelValue: ['foo ', 'bar'],
          options: ['foo', 'bar', 'baz'],
        },
      })

      Select.vm.select('bar')
      expect(Select.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('option:selecting Event', () => {
    it('will trigger the option:selecting event when an option is selected', () => {
      const Select = mount(VueSelect)
      Select.vm.select('bar')
      expect(Select.emitted('option:selecting')[0]).toEqual(['bar'])
    })

    it('will trigger the option:selecting event regardless of current value', () => {
      const Select = mount(VueSelect, {
        props: { modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.select('foo')
      Select.vm.select('bar')
      expect(Select.emitted('option:selecting')).toEqual([['foo'], ['bar']])
    })

    it('will trigger the option:selecting event with current selected item when multiple is true', () => {
      const Select = mount(VueSelect, {
        props: { multiple: true, modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.select('bar')
      expect(Select.emitted('option:selecting')[0]).toEqual(['bar'])
    })

    it('will trigger the option:selecting event regardless of current value when multiple is true', () => {
      const Select = mount(VueSelect, {
        props: {
          multiple: true,
          modelValue: ['foo', 'bar'],
          options: ['foo', 'bar'],
        },
      })
      Select.vm.select('bar')
      Select.vm.select('bar')
      expect(Select.emitted('option:selecting')).toEqual([['bar'], ['bar']])
    })
  })

  describe('option:deselected Event', () => {
    it('will trigger the option:deselected event when an option is deselected', () => {
      const Select = mount(VueSelect, {
        props: { modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.deselect('foo')
      expect(Select.emitted('option:deselected')[0]).toEqual(['foo'])
    })

    // V4-DIFF: v3 deselect() emitted option:deselected even for an unselected option ('bar'); v4 deselect() returns early, so only [['foo']] is emitted
    it.skip('will trigger the option:deselected event regardless of current value', () => {
      const Select = mount(VueSelect, {
        props: { modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.deselect('foo')
      Select.vm.deselect('bar')
      expect(Select.emitted('option:deselected')).toEqual([['foo'], ['bar']])
    })

    // V4-DIFF: v3 deselect('bar') emitted option:deselected although only 'foo' was selected; v4 emits nothing (emitted('option:deselected') is undefined)
    it.skip('will trigger the option:selected event with current selected item when multiple is true', () => {
      const Select = mount(VueSelect, {
        props: { multiple: true, modelValue: ['foo'], options: ['foo', 'bar'] },
      })
      Select.vm.deselect('bar')
      expect(Select.emitted('option:deselected')[0]).toEqual(['bar'])
    })

    it('will trigger the option:selected event regardless of current value when multiple is true', () => {
      const Select = mount(VueSelect, {
        props: {
          multiple: true,
          modelValue: ['foo', 'bar'],
          options: ['foo', 'bar'],
        },
      })
      Select.vm.deselect('bar')
      Select.vm.deselect('bar')
      expect(Select.emitted('option:deselected')).toEqual([['bar'], ['bar']])
    })
  })
})
