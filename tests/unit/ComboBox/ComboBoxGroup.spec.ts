import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import ComboBoxGroup from '@/components/ComboBox/ComboBoxGroup.vue'

describe('ComboBoxGroup', () => {
  it('renders an ARIA group labelled by its header', () => {
    const wrapper = mount(ComboBoxGroup, {
      props: { label: 'Fruit' },
      slots: { default: () => h('div', { role: 'option' }, 'Apple') },
    })
    const group = wrapper.find('[role="group"]')
    const labelId = group.attributes('aria-labelledby')
    expect(labelId).toBeTruthy()
    const header = wrapper.find(`[id="${labelId}"]`)
    expect(header.text()).toBe('Fruit')
    expect(header.attributes('role')).toBe('presentation')
    expect(group.find('[role="option"]').text()).toBe('Apple')
  })

  it('accepts a custom header through the label slot', () => {
    const wrapper = mount(ComboBoxGroup, {
      props: { label: 'Fruit' },
      slots: { label: ({ label }: { label: string }) => h('strong', label.toUpperCase()) },
    })
    expect(wrapper.find('strong').text()).toBe('FRUIT')
  })

  it('gives each group a distinct label id', () => {
    const wrapper = mount({
      render: () => [
        h(ComboBoxGroup, { label: 'A' }),
        h(ComboBoxGroup, { label: 'B' }),
      ],
    })
    const ids = wrapper.findAll('[role="group"]').map((g) => g.attributes('aria-labelledby'))
    expect(new Set(ids).size).toBe(2)
  })
})
