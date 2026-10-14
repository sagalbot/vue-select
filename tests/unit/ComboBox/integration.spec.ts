import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxMenu,
  ComboBoxOption,
  ComboBoxButton,
  ComboBoxClear,
  ComboBoxGroup,
} from '@/index'
import { ComboBoxKey } from '@/keys'
import type { OptionValue } from '@/types'

/**
 * A helper component that injects ComboBoxContext and renders
 * filteredOptions as ComboBoxOption children inside ComboBoxMenu.
 * This mirrors real-world usage where the consumer reads from the
 * context to know which options to display after filtering.
 */
const FilteredOptionList = defineComponent({
  setup() {
    const ctx = inject(ComboBoxKey)!
    return { ctx }
  },
  render() {
    return this.ctx.filteredOptions.value.map((opt: OptionValue, i: number) =>
      h(
        ComboBoxOption,
        { value: opt, index: i, key: this.ctx.getOptionKey(opt) },
        {
          default: ({
            isSelected,
            isHighlighted,
          }: {
            isSelected: boolean
            isHighlighted: boolean
          }) =>
            h(
              'span',
              {
                class: {
                  selected: isSelected,
                  highlighted: isHighlighted,
                },
              },
              String(opt)
            ),
        }
      )
    )
  },
})

const TestSelect = defineComponent({
  props: {
    options: { type: Array, default: () => [] },
    modelValue: { type: [String, Number, Object, Array], default: undefined },
    multiple: { type: Boolean, default: false },
    taggable: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    searchable: { type: Boolean, default: true },
    mapKeydown: { type: Function, default: undefined },
  },
  emits: ['update:modelValue', 'update:open'],
  setup(props, { emit }) {
    return () =>
      h(
        ComboBox,
        {
          ...props,
          'onUpdate:modelValue': (v: unknown) => emit('update:modelValue', v),
          'onUpdate:open': (v: boolean) => emit('update:open', v),
        },
        {
          default: () => [
            h(ComboBoxInput),
            h(ComboBoxButton, null, { default: () => 'Toggle' }),
            h(ComboBoxClear, null, { default: () => 'Clear' }),
            h(ComboBoxMenu, null, {
              default: () => h(FilteredOptionList),
            }),
          ],
        }
      )
  },
})

/** Wait for all pending Vue reactivity and DOM updates. */
async function waitForUpdate() {
  await nextTick()
  await nextTick()
}

/**
 * Checks whether the listbox menu is showing. We rely on the inline
 * style.display set by v-show because jsdom's getComputedStyle does
 * not propagate inline styles, which causes vue-test-utils' isVisible()
 * to give false positives in deeply-nested component trees.
 */
function isListboxVisible(wrapper: ReturnType<typeof mount>): boolean {
  const el = wrapper.find('[role="listbox"]').element as HTMLElement
  return el.style.display !== 'none'
}

describe('ComboBox integration', () => {
  it('full selection flow: open, navigate, select', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    // Focus input to open
    await wrapper.find('input').trigger('focus')
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(true)

    // Arrow down twice to highlight 'two'
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await waitForUpdate()
    expect(wrapper.find('.highlighted').text()).toBe('two')

    // Enter to select
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])
  })

  it('multi-select flow', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'], multiple: true, modelValue: [] },
    })

    await wrapper.find('input').trigger('focus')
    await waitForUpdate()

    // Click 'one'
    await wrapper.findAll('[role="option"]')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['one']])
  })

  it('filtering flow', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('input').trigger('focus')
    await waitForUpdate()

    await wrapper.find('input').setValue('tw')
    await waitForUpdate()

    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0].text()).toBe('two')
  })

  it('escape closes dropdown', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('input').trigger('focus')
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(true)

    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(false)
  })

  it('toggle button opens and closes dropdown', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('button').trigger('click')
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(true)

    await wrapper.find('button').trigger('click')
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(false)
  })

  it('clicking an option selects it', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('input').trigger('focus')
    await waitForUpdate()
    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])
  })

  it('ARIA attributes are properly connected', () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two'] },
    })

    const combobox = wrapper.find('[role="combobox"]')
    const listbox = wrapper.find('[role="listbox"]')
    const options = wrapper.findAll('[role="option"]')

    expect(combobox.exists()).toBe(true)
    expect(listbox.exists()).toBe(true)
    expect(options).toHaveLength(2)

    // The combobox (input) controls the listbox
    expect(combobox.attributes('aria-controls')).toBe(listbox.attributes('id'))
  })

  it('stays closed when open is bound to false', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['a', 'b'], open: false },
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('button').trigger('click')
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(false)
    expect(wrapper.emitted('update:open')).toEqual([[true], [true]])
    wrapper.unmount()
  })

  it('opens when a bound open prop becomes true', async () => {
    const wrapper = mount(TestSelect, { props: { options: ['a'], open: false } })
    await wrapper.setProps({ open: true })
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(true)
  })

  it('select-only: keyboard opens, navigates and selects', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['apple', 'banana'], searchable: false },
    })
    const combobox = wrapper.find('[role="combobox"]')
    await combobox.trigger('keydown', { key: ' ' })
    await waitForUpdate()
    expect(isListboxVisible(wrapper)).toBe(true)
    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
  })

  it('mapKeydown: comma creates a tag', async () => {
    const wrapper = mount(TestSelect, {
      props: {
        options: ['a'],
        taggable: true,
        multiple: true,
        modelValue: [],
        mapKeydown: (map: Record<string, unknown>) => ({ ...map, ',': map.Enter }),
      },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('new')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: ',' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[['new']]])
  })

  it('multi-select keeps the search text on blur', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['apple', 'banana'], multiple: true, modelValue: [] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('ban')
    await input.trigger('blur')
    await waitForUpdate()
    expect((input.element as HTMLInputElement).value).toBe('ban')
    expect(isListboxVisible(wrapper)).toBe(false)
  })

  it('grouped options: keyboard highlight follows the rendered order', async () => {
    const options = ['banana', 'apple', 'blueberry']
    const GroupedList = defineComponent({
      setup() {
        const ctx = inject(ComboBoxKey)!
        return () =>
          ctx.groupedOptions.value.map((group) =>
            h(ComboBoxGroup, { label: String(group.label), key: String(group.label) }, () =>
              group.options.map(({ option, index }) =>
                h(ComboBoxOption, { value: option, index, key: String(option) }, () =>
                  String(option)
                )
              )
            )
          )
      },
    })
    const wrapper = mount(ComboBox, {
      props: { options, groupBy: (o: OptionValue) => String(o)[0] },
      slots: { default: () => [h(ComboBoxInput), h(ComboBoxMenu, () => h(GroupedList))] },
    })

    expect(wrapper.findAll('[role="group"]').map((g) => g.text())).toEqual([
      'bbananablueberry',
      'aapple',
    ])

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    const active = input.attributes('aria-activedescendant')
    expect(wrapper.find(`[id="${active}"]`).text()).toBe('blueberry')
  })
})
