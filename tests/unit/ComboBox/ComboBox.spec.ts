import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { inject, defineComponent, h } from 'vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import WrappedComboBox from './fixtures/WrappedComboBox.vue'
import { ComboBoxKey } from '@/keys'

// Helper component to inspect injected context
const ContextReader = defineComponent({
  setup() {
    const ctx = inject(ComboBoxKey)!
    return { ctx }
  },
  render() {
    return h('div', `open:${this.ctx.open.value}`)
  },
})

function mountComboBox(props = {}) {
  return mount(ComboBox, {
    props: { options: ['one', 'two', 'three'], ...props },
    slots: { default: () => h(ContextReader) },
  })
}

describe('ComboBox', () => {
  it('provides ComboBoxContext to children', () => {
    const wrapper = mountComboBox()
    const reader = wrapper.findComponent(ContextReader)
    expect(reader.vm.ctx).toBeDefined()
    expect(reader.vm.ctx.open.value).toBe(false)
  })

  it('does not have role=combobox on wrapper (role is on input)', () => {
    const wrapper = mountComboBox()
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('does not have aria-expanded on wrapper (managed by input)', () => {
    const wrapper = mountComboBox()
    expect(wrapper.attributes('aria-expanded')).toBeUndefined()
  })

  it('emits update:modelValue when selection changes', () => {
    const wrapper = mountComboBox()
    const reader = wrapper.findComponent(ContextReader)
    reader.vm.ctx.select('one')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['one'])
  })

  it('renders slot content', () => {
    const wrapper = mountComboBox()
    expect(wrapper.text()).toContain('open:false')
  })

  it('passes all props through to useComboBox', () => {
    const wrapper = mountComboBox({ multiple: true, placeholder: 'Pick...' })
    const reader = wrapper.findComponent(ContextReader)
    expect(reader.vm.ctx.multiple.value).toBe(true)
    expect(reader.vm.ctx.placeholder.value).toBe('Pick...')
  })

  it('passes state to the default slot', async () => {
    const wrapper = mount(ComboBox, {
      props: { options: ['one', 'two', 'three'], modelValue: 'two', open: true },
      slots: {
        default: (state: { open: boolean; filteredOptions: string[]; selected: string[] }) =>
          h('div', `${state.open}|${state.filteredOptions.join(',')}|${state.selected.join(',')}`),
      },
    })
    expect(wrapper.text()).toBe('true|one,two,three|two')
  })

  describe('wrapped in a component with comboBoxDefaults', () => {
    it('keeps filtering on and opening uncontrolled', async () => {
      const wrapper = mount(WrappedComboBox, { props: { options: ['apple', 'banana'] } })
      await wrapper.find('button').trigger('click')
      const listbox = wrapper.get('[role="listbox"]').element as HTMLElement
      expect(listbox.style.display).not.toBe('none')
      await wrapper.find('input').setValue('ban')
      expect(wrapper.findAll('[role="option"]').map((o) => o.text())).toEqual(['banana'])
    })

    it('passes methods to the default slot', async () => {
      const wrapper = mount(WrappedComboBox, { props: { options: ['apple'], modelValue: 'apple' } })
      await wrapper.get('button.clear').trigger('click')
      expect(wrapper.findComponent(ComboBox).emitted('update:modelValue')).toEqual([[null]])
    })
  })

  it('exposes methods on a template ref', async () => {
    const wrapper = mount(ComboBox, { props: { options: ['a', 'b'] } })
    const vm = wrapper.vm as unknown as { select: (o: string) => void; setOpen: (v: boolean) => void }
    vm.select('b')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    vm.setOpen(true)
    expect(wrapper.emitted('open')).toHaveLength(1)
  })
})
