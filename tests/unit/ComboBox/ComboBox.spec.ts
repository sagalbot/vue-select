import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { inject, defineComponent, h } from 'vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
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
})
