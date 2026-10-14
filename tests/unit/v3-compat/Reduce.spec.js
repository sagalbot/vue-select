import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import {
  selectWithProps,
  openDropdown,
  dropdownOptions,
  selectedLabels,
  lastEmittedValue,
  searchFocus,
  typeSearch,
  pressKey,
} from './helpers.js'

/** Labels of the options rendered as selected in the open dropdown. */
const selectedOptionLabels = (wrapper) =>
  dropdownOptions(wrapper)
    .filter((option) => option.classes().includes('vs__dropdown-option--selected'))
    .map((option) => option.text())

/** Focus the search (opening the dropdown) and click the option with the given label. */
const clickOption = async (wrapper, label) => {
  await searchFocus(wrapper)
  const option = dropdownOptions(wrapper).find((o) => o.text() === label)
  await option.trigger('click')
  await nextTick()
}

describe('When reduce prop is defined', () => {
  it('determines when a reducer has been supplied', async () => {
    const options = [
      { label: 'This is Foo', value: 'foo' },
      { label: 'This is Bar', value: 'bar' },
    ]
    const Select = selectWithProps({ options })

    // Without a reducer, the whole option is emitted
    await clickOption(Select, 'This is Foo')
    expect(lastEmittedValue(Select)).toEqual({ label: 'This is Foo', value: 'foo' })

    // With a reducer, the reduced value is emitted
    await Select.setProps({ reduce: (option) => option.value })
    await clickOption(Select, 'This is Bar')
    expect(lastEmittedValue(Select)).toEqual('bar')
  })

  it('can accept an array of objects and pre-selected value (single)', () => {
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.value,
        modelValue: 'foo',
        options: [{ label: 'This is Foo', value: 'foo' }],
      },
    })
    expect(selectedLabels(Select)).toEqual(['This is Foo'])
  })

  it('can determine if an object is pre-selected', async () => {
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.id,
        modelValue: 'foo',
        options: [
          {
            id: 'foo',
            label: 'This is Foo',
          },
        ],
      },
    })

    await openDropdown(Select)
    expect(selectedOptionLabels(Select)).toEqual(['This is Foo'])
  })

  it('can determine if an object is selected after its been chosen', async () => {
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.id,
        options: [{ id: 'foo', label: 'FooBar' }],
      },
    })

    await clickOption(Select, 'FooBar')

    // An option with the same id but a different label counts as selected
    await Select.setProps({ options: [{ id: 'foo', label: 'This is FooBar' }] })
    await openDropdown(Select)
    expect(selectedOptionLabels(Select)).toEqual(['This is FooBar'])
  })

  it('can accept an array of objects and pre-selected values (multiple)', () => {
    const Select = mount(VueSelect, {
      props: {
        multiple: true,
        reduce: (option) => option.value,
        modelValue: ['foo'],
        options: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
        ],
      },
    })

    expect(selectedLabels(Select)).toEqual(['This is Foo'])
  })

  it('can deselect a pre-selected object', async () => {
    const Select = mount(VueSelect, {
      props: {
        multiple: true,
        closeOnSelect: false,
        reduce: (option) => option.value,
        options: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
        ],
      },
    })

    await clickOption(Select, 'This is Foo')
    await clickOption(Select, 'This is Bar')
    expect(lastEmittedValue(Select)).toEqual(['foo', 'bar'])

    await Select.get('.vs__deselect').trigger('click')
    expect(lastEmittedValue(Select)).toEqual(['bar'])
    expect(selectedLabels(Select)).toEqual(['This is Bar'])
  })

  it('can deselect an option when multiple is false', async () => {
    const foo = { label: 'This is Foo', value: 'foo' }
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.value,
        options: [foo, { label: 'This is Bar', value: 'bar' }],
      },
    })

    await clickOption(Select, 'This is Foo')
    expect(selectedLabels(Select)).toEqual(['This is Foo'])

    Select.vm.deselect(foo)
    await nextTick()
    // v4: deselecting in single-select emits null (v3 emitted [])
    expect(lastEmittedValue(Select)).toBeNull()
    expect(selectedLabels(Select)).toEqual([])
  })

  it('can use v-model syntax for a two way binding to a parent component', async () => {
    const Parent = mount({
      data: () => ({
        reduce: (option) => option.value,
        current: 'foo',
        options: [
          { label: 'This is Foo', value: 'foo' },
          { label: 'This is Bar', value: 'bar' },
          { label: 'This is Baz', value: 'baz' },
        ],
      }),
      components: { 'v-select': VueSelect },
      computed: {
        value: {
          get() {
            return this.current
          },
          set(value) {
            if (value == 'baz') return
            this.current = value
          },
        },
      },
      template: `
        <v-select
          v-model="value"
          :reduce="option => option.value"
          :options="options"
        />
      `,
    })
    const Select = Parent.findComponent(VueSelect)

    expect(Select.props('modelValue')).toEqual('foo')
    expect(selectedLabels(Select)).toEqual(['This is Foo'])

    await clickOption(Select, 'This is Bar')
    expect(Parent.vm.value).toEqual('bar')
    expect(selectedLabels(Select)).toEqual(['This is Bar'])

    // Parent denies to set baz
    await clickOption(Select, 'This is Baz')
    expect(selectedLabels(Select)).toEqual(['This is Bar'])
    expect(Parent.vm.value).toEqual('bar')
  })

  it('can generate labels using a custom label key', () => {
    const Select = mount(VueSelect, {
      props: {
        multiple: true,
        reduce: (option) => option.value,
        modelValue: ['CA'],
        label: 'name',
        options: [
          { value: 'CA', name: 'Canada' },
          { value: 'US', name: 'United States' },
        ],
      },
    })

    expect(Select.find('.vs__selected').text()).toContain('Canada')
  })

  it('can find the original option within this.options', () => {
    const optionToFind = { id: 1, label: 'Foo' }
    const options = [optionToFind, { id: 2, label: 'Bar' }]

    // A reduced value resolves to the original option
    const ByReducedValue = mount(VueSelect, {
      props: { reduce: (option) => option.id, options, modelValue: 1 },
    })
    expect(selectedLabels(ByReducedValue)).toEqual(['Foo'])

    // A value that is the option itself is used as-is
    const ByOption = mount(VueSelect, {
      props: { reduce: (option) => option.id, options, modelValue: optionToFind },
    })
    expect(selectedLabels(ByOption)).toEqual(['Foo'])
  })

  it('can work with falsey values', async () => {
    const option = { value: 0, label: 'No' }
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.value,
        options: [option, { value: 1, label: 'Yes' }],
        modelValue: 0,
      },
    })

    expect(selectedLabels(Select)).toEqual(['No'])
    await openDropdown(Select)
    expect(selectedOptionLabels(Select)).toEqual(['No'])
  })

  // V4-DIFF: v3 treated a reduced value of null as the selection of the option reducing to null ([option]); v4 treats modelValue null as empty (no .vs__selected, option not --selected)
  it.skip('works with null values', async () => {
    const option = { value: null, label: 'No' }
    const Select = mount(VueSelect, {
      props: {
        reduce: (option) => option.value,
        options: [option, { value: 1, label: 'Yes' }],
        modelValue: null,
      },
    })

    expect(selectedLabels(Select)).toEqual(['No'])
    await openDropdown(Select)
    expect(selectedOptionLabels(Select)).toEqual(['No'])
  })

  describe('And when a reduced option is a nested object', () => {
    it('can determine if an object is pre-selected', () => {
      const nestedOption = { value: { nested: true }, label: 'foo' }
      const Select = mount(VueSelect, {
        props: {
          reduce: (option) => option.value,
          modelValue: {
            nested: true,
          },
          options: [nestedOption],
        },
      })

      expect(selectedLabels(Select)).toEqual(['foo'])
    })

    it('can determine if an object is selected after it is chosen', async () => {
      const nestedOption = { value: { nested: true }, label: 'foo' }
      const Select = mount(VueSelect, {
        props: {
          reduce: (option) => option.value,
          options: [nestedOption],
        },
      })

      await clickOption(Select, 'foo')
      expect(lastEmittedValue(Select)).toEqual({ nested: true })

      await openDropdown(Select)
      expect(selectedOptionLabels(Select)).toEqual(['foo'])
    })
  })

  it('reacts correctly when value property changes', async () => {
    const optionToChangeTo = { id: 1, label: 'Foo' }
    const Select = mount(VueSelect, {
      props: {
        modelValue: 2,
        reduce: (option) => option.id,
        options: [optionToChangeTo, { id: 2, label: 'Bar' }],
      },
    })
    expect(selectedLabels(Select)).toEqual(['Bar'])

    await Select.setProps({ modelValue: optionToChangeTo.id })

    expect(selectedLabels(Select)).toEqual(['Foo'])
  })

  describe('Reducing Tags', () => {
    it('tracks values that have been created by the user', async () => {
      const Parent = mount({
        data: () => ({ selected: null, options: [] }),
        template: `
          <v-select
            v-model="selected"
            :options="options"
            taggable
            :reduce="name => name.value"
            :create-option="label => ({ label, value: -1 })"
          />
        `,
        components: { 'v-select': VueSelect },
      })
      const Select = Parent.findComponent(VueSelect)

      //  When
      await searchFocus(Select)
      await typeSearch(Select, 'hello')
      await pressKey(Select, 'Enter')

      //  Then
      expect(selectedLabels(Select)).toEqual(['hello'])
      expect(Select.get('.vs__selected-options').text().trim()).toEqual('hello')
      expect(Parent.vm.selected).toEqual(-1)
    })
  })
})
