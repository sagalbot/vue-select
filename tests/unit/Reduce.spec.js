import { nextTick } from "vue"
import { mount, shallowMount } from '@vue/test-utils'
import VueSelect from '../../src/components/Select.vue'

describe('When reduce prop is defined', () => {
  it('can accept an array of objects and pre-selected value (single)', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.modelValue,
        modelValue: 'foo',
        options: [{ label: 'This is Foo', modelValue: 'foo' }],
      },
    })
    expect(Select.vm.selectedValue).toEqual([
      { label: 'This is Foo', modelValue: 'foo' },
    ])
  })

  it('can determine if an object is pre-selected', () => {
    const Select = shallowMount(VueSelect, {
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

    expect(
      Select.vm.isOptionSelected({
        id: 'foo',
        label: 'This is Foo',
      })
    ).toEqual(true)
  })

  it('can determine if an object is selected after its been chosen', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.id,
        options: [{ id: 'foo', label: 'FooBar' }],
      },
    })

    Select.vm.select({ id: 'foo', label: 'FooBar' })

    expect(
      Select.vm.isOptionSelected({
        id: 'foo',
        label: 'This is FooBar',
      })
    ).toEqual(true)
  })

  it('can accept an array of objects and pre-selected values (multiple)', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        reduce: (option) => option.modelValue,
        modelValue: ['foo'],
        options: [
          { label: 'This is Foo', modelValue: 'foo' },
          { label: 'This is Bar', modelValue: 'bar' },
        ],
      },
    })

    expect(Select.vm.selectedValue).toEqual([
      { label: 'This is Foo', modelValue: 'foo' },
    ])
  })

  it('can deselect a pre-selected object', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        reduce: (option) => option.modelValue,
        options: [
          { label: 'This is Foo', modelValue: 'foo' },
          { label: 'This is Bar', modelValue: 'bar' },
        ],
      },
    })

    Select.vm.$data._value = ['foo', 'bar']

    Select.vm.deselect('foo')
    expect(Select.vm.selectedValue).toEqual(['bar'])
  })

  it('can deselect an option when multiple is false', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.modelValue,
        options: [
          { label: 'This is Foo', modelValue: 'foo' },
          { label: 'This is Bar', modelValue: 'bar' },
        ],
      },
    })

    Select.vm.deselect('foo')
    expect(Select.vm.selectedValue).toEqual([])
  })

  it('can use v-model syntax for a two way binding to a parent component', async () => {
    const Parent = mount({
      data: () => ({
        reduce: (option) => option.modelValue,
        current: 'foo',
        options: [
          { label: 'This is Foo', modelValue: 'foo' },
          { label: 'This is Bar', modelValue: 'bar' },
          { label: 'This is Baz', modelValue: 'baz' },
        ],
      }),
      components: { 'v-select': VueSelect },
      computed: {
        modelValue: {
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
          v-model="modelValue"
          :reduce="option => option.modelValue"
          :options="options"
        />
      `,
    })
    const Select = Parent.findComponent(VueSelect).vm

    expect(Select.modelValue).toEqual('foo')
    expect(Select.selectedValue).toEqual([
      { label: 'This is Foo', modelValue: 'foo' },
    ])

    Select.select({ label: 'This is Bar', modelValue: 'bar' })
    await nextTick()
    expect(Parent.vm.modelValue).toEqual('bar')
    expect(Select.selectedValue).toEqual([
      { label: 'This is Bar', modelValue: 'bar' },
    ])

    // Parent denies to set baz
    Select.select({ label: 'This is Baz', modelValue: 'baz' })
    await nextTick()
    expect(Select.selectedValue).toEqual([
      { label: 'This is Bar', modelValue: 'bar' },
    ])
    expect(Parent.vm.modelValue).toEqual('bar')
  })

  it('can generate labels using a custom label key', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        multiple: true,
        reduce: (option) => option.modelValue,
        modelValue: ['CA'],
        label: 'name',
        options: [
          { modelValue: 'CA', name: 'Canada' },
          { modelValue: 'US', name: 'United States' },
        ],
      },
    })

    expect(Select.find('.vs__selected').text()).toContain('Canada')
  })

  it('can find the original option within this.options', () => {
    const optionToFind = { id: 1, label: 'Foo' }
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.id,
        options: [optionToFind, { id: 2, label: 'Bar' }],
      },
    })

    expect(Select.vm.findOptionFromReducedValue(1)).toEqual(optionToFind)
    expect(Select.vm.findOptionFromReducedValue(optionToFind)).toEqual(
      optionToFind
    )
  })

  it('can work with falsey values', () => {
    const option = { modelValue: 0, label: 'No' }
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.modelValue,
        options: [option, { modelValue: 1, label: 'Yes' }],
        modelValue: 0,
      },
    })

    expect(Select.vm.findOptionFromReducedValue(option)).toEqual(option)
    expect(Select.vm.selectedValue).toEqual([option])
  })

  it('works with null values', () => {
    const option = { modelValue: null, label: 'No' }
    const Select = shallowMount(VueSelect, {
      props: {
        reduce: (option) => option.modelValue,
        options: [option, { modelValue: 1, label: 'Yes' }],
        modelValue: null,
      },
    })

    expect(Select.vm.findOptionFromReducedValue(option)).toEqual(option)
    expect(Select.vm.selectedValue).toEqual([option])
  })

  describe('And when a reduced option is a nested object', () => {
    it('can determine if an object is pre-selected', () => {
      const nestedOption = { modelValue: { nested: true }, label: 'foo' }
      const Select = shallowMount(VueSelect, {
        props: {
          reduce: (option) => option.modelValue,
          modelValue: {
            nested: true,
          },
          options: [nestedOption],
        },
      })

      expect(Select.vm.selectedValue).toEqual([nestedOption])
    })

    it('can determine if an object is selected after it is chosen', () => {
      const nestedOption = { modelValue: { nested: true }, label: 'foo' }
      const Select = shallowMount(VueSelect, {
        props: {
          reduce: (option) => option.modelValue,
          options: [nestedOption],
        },
      })

      Select.vm.select(nestedOption)
      expect(Select.vm.isOptionSelected(nestedOption)).toEqual(true)
    })
  })

  it('reacts correctly when value property changes', async () => {
    const optionToChangeTo = { id: 1, label: 'Foo' }
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: 2,
        reduce: (option) => option.id,
        options: [optionToChangeTo, { id: 2, label: 'Bar' }],
      },
    })

    Select.setProps({ modelValue: optionToChangeTo.id })
    await nextTick()

    expect(Select.vm.selectedValue).toEqual([optionToChangeTo])
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
            :reduce="name => name.modelValue"
            :create-option="label => ({ label, modelValue: -1 })"
          />
        `,
        components: { 'v-select': VueSelect },
      })
      const Select = Parent.findComponent(VueSelect).vm

      //  When
      Select.$refs.search.focus()
      await nextTick()

      Select.search = 'hello'
      await nextTick()

      Select.typeAheadSelect()
      await nextTick()

      //  Then
      expect(Select.selectedValue).toEqual([{ label: 'hello', modelValue: -1 }])
      expect(Select.$refs.selectedOptions.textContent.trim()).toEqual('hello')
      expect(Parent.vm.selected).toEqual(-1)
    })
  })
})
