import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import ComboBoxClear from '@/components/ComboBox/ComboBoxClear.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountClear(ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxClear, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: 'x' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxClear', () => {
  it('is not visible when value is empty', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => true) })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is not visible when clearable is false', () => {
    const { wrapper } = mountClear({
      isValueEmpty: computed(() => false),
      clearable: computed(() => false),
    })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is visible when value is not empty and clearable', () => {
    const { wrapper } = mountClear({
      isValueEmpty: computed(() => false),
      clearable: computed(() => true),
    })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('click calls clearSelection', async () => {
    const { wrapper, ctx } = mountClear({
      isValueEmpty: computed(() => false),
    })
    await wrapper.trigger('click')
    expect(ctx.clearSelection).toHaveBeenCalled()
  })

  it('renders slot content', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => false) })
    expect(wrapper.text()).toBe('x')
  })

  it('has aria-label', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => false) })
    expect(wrapper.attributes('aria-label')).toBe('Clear selection')
  })
})
