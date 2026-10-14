import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import VueSelect from '@/components/VueSelect.vue'
import type { OptionValue } from '@/types'

/** A real click: mousedown, then click. */
async function press(el: { trigger: (event: string) => Promise<void> }) {
  await el.trigger('mousedown')
  await el.trigger('click')
}

describe('VueSelect (v4)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('select-only (searchable: false)', () => {
    it('opens on click and stays open', async () => {
      const wrapper = mount(VueSelect, { props: { options: ['a', 'b'], searchable: false } })
      await press(wrapper.get('.vs__search'))
      expect(wrapper.classes()).toContain('vs--open')
    })

    it('a second click closes it', async () => {
      const wrapper = mount(VueSelect, { props: { options: ['a', 'b'], searchable: false } })
      await press(wrapper.get('.vs__search'))
      await press(wrapper.get('.vs__search'))
      expect(wrapper.classes()).not.toContain('vs--open')
    })
  })

  it('hides the decorative open indicator from assistive tech', () => {
    const wrapper = mount(VueSelect, { props: { options: ['a'] } })
    expect(wrapper.get('.vs__open-indicator').attributes('aria-hidden')).toBe('true')
  })

  it('does not open when the input receives focus', async () => {
    const wrapper = mount(VueSelect, { props: { options: ['a'] } })
    await wrapper.get('.vs__search').trigger('focus')
    expect(wrapper.classes()).not.toContain('vs--open')
  })

  describe('option groups', () => {
    const options = [
      { label: 'Banana', type: 'Tropical' },
      { label: 'Apple', type: 'Orchard' },
      { label: 'Mango', type: 'Tropical' },
    ]
    const groupBy = (o: OptionValue) => (o as { type: string }).type

    it('renders a labelled group per groupBy value, in order of first appearance', async () => {
      const wrapper = mount(VueSelect, { props: { options, groupBy, open: true } })
      const groups = wrapper.findAll('[role="group"]')
      expect(groups).toHaveLength(2)
      const labels = groups.map((g) => wrapper.get(`[id="${g.attributes('aria-labelledby')}"]`).text())
      expect(labels).toEqual(['Tropical', 'Orchard'])
      expect(groups[0].findAll('.vs__dropdown-option').map((o) => o.text())).toEqual([
        'Banana',
        'Mango',
      ])
    })

    it('renders the group-header slot', () => {
      const wrapper = mount(VueSelect, {
        props: { options, groupBy, open: true },
        slots: {
          'group-header': ({ label, options }: { label: string; options: unknown[] }) =>
            `${label} (${options.length})`,
        },
      })
      expect(wrapper.findAll('.vs__dropdown-group-label').map((l) => l.text())).toEqual([
        'Tropical (2)',
        'Orchard (1)',
      ])
    })

    it('arrow keys follow the grouped order', async () => {
      const wrapper = mount(VueSelect, { props: { options, groupBy, open: true } })
      const input = wrapper.get('.vs__search')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'ArrowDown' })
      // Banana, Mango (Tropical), then Apple: the second press is Mango
      expect(wrapper.get('.vs__dropdown-option--highlight').text()).toBe('Mango')
    })
  })

  describe('appendTo', () => {
    // Use the real <Transition>; test-utils' stub adds a wrapper element
    const global = { stubs: { transition: false } }

    it('teleports the dropdown and positions it under the toggle', async () => {
      const calculatePosition = vi.fn()
      const wrapper = mount(VueSelect, {
        props: { options: ['a'], appendTo: 'body', calculatePosition },
        attachTo: document.body,
        global,
      })
      await press(wrapper.get('.vs__search'))
      await nextTick()

      const menu = [...document.body.children].find((el) =>
        el.classList.contains('vs__dropdown-menu')
      )
      expect(menu).not.toBeNull()
      expect(wrapper.element.contains(menu)).toBe(false)
      // Check arguments one by one: the second is the (circular) context
      expect(calculatePosition).toHaveBeenCalledTimes(1)
      const [element, , position] = calculatePosition.mock.calls[0]
      expect(element === menu).toBe(true)
      expect(Object.keys(position).sort()).toEqual(['left', 'top', 'width'])
      wrapper.unmount()
    })

    it('calls the cleanup from calculatePosition on close and removes the menu on unmount', async () => {
      const cleanup = vi.fn()
      const wrapper = mount(VueSelect, {
        props: { options: ['a'], appendTo: 'body', calculatePosition: () => cleanup },
        attachTo: document.body,
        global,
      })
      await press(wrapper.get('.vs__search'))
      await nextTick()
      wrapper.vm.open = false
      await nextTick()
      expect(cleanup).toHaveBeenCalledTimes(1)

      wrapper.unmount()
      expect(document.body.querySelector('.vs__dropdown-menu')).toBeNull()
    })
  })

  describe('ariaLabels', () => {
    it('labels the search input, clear and deselect buttons', () => {
      const wrapper = mount(VueSelect, {
        props: {
          options: ['a', 'b'],
          modelValue: ['a'],
          multiple: true,
          ariaLabels: {
            search: 'Fruit',
            clear: 'Alles löschen',
            deselect: (label: string) => `${label} entfernen`,
          },
        },
      })
      expect(wrapper.get('.vs__search').attributes('aria-label')).toBe('Fruit')
      expect(wrapper.get('.vs__clear').attributes('aria-label')).toBe('Alles löschen')
      expect(wrapper.get('.vs__deselect').attributes('aria-label')).toBe('a entfernen')
    })

    it('leaves the input unnamed when it is labelled by id', () => {
      const wrapper = mount(VueSelect, { props: { options: ['a'], inputAttrs: { id: 'fruit' } } })
      const input = wrapper.get('.vs__search')
      expect(input.attributes('id')).toBe('fruit')
      expect(input.attributes('aria-label')).toBeUndefined()
    })
  })

  it('emits clear when the clear button is used', async () => {
    const wrapper = mount(VueSelect, { props: { options: ['a'], modelValue: 'a' } })
    await wrapper.get('.vs__clear').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('hydrates server-rendered markup without mismatches', async () => {
    const App = { render: () => h(VueSelect, { options: ['a', 'b'], open: true, modelValue: 'a' }) }
    const html = await renderToString(createSSRApp(App))

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const container = document.createElement('div')
    container.innerHTML = html
    createSSRApp(App).mount(container)

    const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n')
    expect(messages).not.toMatch(/hydration/i)
  })
})
