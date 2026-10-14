import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ComboBoxButton from '@/components/ComboBox/ComboBoxButton.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountButton(ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxButton, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: 'Toggle' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxButton', () => {
  it('has aria-haspopup="listbox"', () => {
    const { wrapper } = mountButton()
    expect(wrapper.attributes('aria-haspopup')).toBe('listbox')
  })

  it('has aria-expanded reflecting open state', () => {
    const { wrapper } = mountButton({ open: ref(true) })
    expect(wrapper.attributes('aria-expanded')).toBe('true')
  })

  it('has aria-controls pointing to listbox', () => {
    const { wrapper } = mountButton()
    expect(wrapper.attributes('aria-controls')).toBe('vs-test-listbox')
  })

  it('click calls toggleOpen', async () => {
    const { wrapper, ctx } = mountButton()
    await wrapper.trigger('click')
    expect(ctx.toggleOpen).toHaveBeenCalled()
  })

  it('is disabled when context is disabled', () => {
    const { wrapper } = mountButton({ disabled: computed(() => true) })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders slot content', () => {
    const { wrapper } = mountButton()
    expect(wrapper.text()).toBe('Toggle')
  })
})
