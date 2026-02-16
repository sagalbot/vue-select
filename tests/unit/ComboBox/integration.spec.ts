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
} from '@/index'
import { ComboBoxKey } from '@/keys'

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
    return this.ctx.filteredOptions.value.map((opt: any, i: number) =>
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        ComboBox,
        {
          ...props,
          'onUpdate:modelValue': (v: unknown) => emit('update:modelValue', v),
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
})
