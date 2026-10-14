import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountMenu(ctxOverrides = {}, slotContent?: string) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxMenu, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: slotContent ?? 'Menu content' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxMenu', () => {
  it('has role="listbox"', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('role')).toBe('listbox')
  })

  it('has correct id', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('id')).toBe('vs-test-listbox')
  })

  it('has tabindex="-1"', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('is visible when open is true', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('is hidden when open is false', () => {
    const { wrapper } = mountMenu({ open: ref(false) })
    expect(wrapper.isVisible()).toBe(false)
  })


  it('renders slot content', () => {
    const { wrapper } = mountMenu({ open: ref(true) }, 'Test options')
    expect(wrapper.text()).toContain('Test options')
  })
})
