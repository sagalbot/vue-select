import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountOption(props = {}, ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxOption, {
    props: { value: 'test', index: 0, ...props },
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: {
      default: (slotProps: { isSelected: boolean; isHighlighted: boolean; isDisabled: boolean }) =>
        `selected:${slotProps.isSelected},highlighted:${slotProps.isHighlighted},disabled:${slotProps.isDisabled}`,
    },
  })
  return { wrapper, ctx }
}

describe('ComboBoxOption', () => {
  it('has role="option"', () => {
    const { wrapper } = mountOption()
    expect(wrapper.attributes('role')).toBe('option')
  })

  it('has correct id', () => {
    const { wrapper } = mountOption({ index: 3 })
    expect(wrapper.attributes('id')).toBe('vs-test-option-3')
  })

  it('sets aria-selected when selected', () => {
    const { wrapper } = mountOption({}, { isOptionSelected: () => true })
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })

  it('sets aria-selected="false" when not selected', () => {
    const { wrapper } = mountOption()
    expect(wrapper.attributes('aria-selected')).toBe('false')
  })

  it('sets aria-disabled when not selectable', () => {
    const { wrapper } = mountOption({}, { isOptionSelectable: () => false })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('click calls select when not selected', async () => {
    const { wrapper, ctx } = mountOption()
    await wrapper.trigger('click')
    expect(ctx.select).toHaveBeenCalledWith('test')
  })

  it('click on a selected option calls select, which decides whether to deselect', async () => {
    const { wrapper, ctx } = mountOption({}, { isOptionSelected: () => true })
    await wrapper.trigger('click')
    expect(ctx.select).toHaveBeenCalledWith('test')
  })

  it('click does nothing when disabled', async () => {
    const { wrapper, ctx } = mountOption({}, { isOptionSelectable: () => false })
    await wrapper.trigger('click')
    expect(ctx.select).not.toHaveBeenCalled()
    expect(ctx.deselect).not.toHaveBeenCalled()
  })

  it('mouseover updates typeAheadPointer', async () => {
    const pointer = ref(-1)
    const { wrapper } = mountOption({ index: 2 }, { typeAheadPointer: pointer })
    await wrapper.trigger('mouseover')
    expect(pointer.value).toBe(2)
  })

  it('exposes isSelected, isHighlighted, isDisabled via slot', () => {
    const { wrapper } = mountOption({}, {
      isOptionSelected: () => true,
      isOptionHighlighted: (i: number) => i === 0,
    })
    expect(wrapper.text()).toContain('selected:true')
    expect(wrapper.text()).toContain('highlighted:true')
    expect(wrapper.text()).toContain('disabled:false')
  })
})
