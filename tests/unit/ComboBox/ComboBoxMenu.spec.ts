import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountMenu(ctxOverrides = {}, slotContent?: string, props = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxMenu, {
    props,
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

  it('renders the element given by as', () => {
    const { wrapper } = mountMenu({}, undefined, { as: 'ul' })
    expect(wrapper.find('[role="listbox"]').element.tagName).toBe('UL')
  })

  it('show overrides the open state', () => {
    const { wrapper } = mountMenu({ open: ref(true) }, undefined, { show: false })
    const el = wrapper.find('[role="listbox"]').element as HTMLElement
    expect(el.style.display).toBe('none')
  })

  describe('accessible name', () => {
    it('defaults to "Options"', () => {
      const { wrapper } = mountMenu()
      expect(wrapper.attributes('aria-label')).toBe('Options')
    })

    it('uses a given aria-label', () => {
      const ctx = createMockContext()
      const wrapper = mount(ComboBoxMenu, {
        attrs: { 'aria-label': 'Countries' },
        global: { provide: { [ComboBoxKey as symbol]: ctx } },
      })
      expect(wrapper.attributes('aria-label')).toBe('Countries')
    })

    it('drops the default when labelled by another element', () => {
      const ctx = createMockContext()
      const wrapper = mount(ComboBoxMenu, {
        attrs: { 'aria-labelledby': 'country-label' },
        global: { provide: { [ComboBoxKey as symbol]: ctx } },
      })
      expect(wrapper.attributes('aria-label')).toBeUndefined()
      expect(wrapper.attributes('aria-labelledby')).toBe('country-label')
    })
  })
})
