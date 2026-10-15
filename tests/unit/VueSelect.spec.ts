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

  describe('toggle button', () => {
    it('is a labelled button outside the tab order that controls the listbox', () => {
      const wrapper = mount(VueSelect, { props: { options: ['a'] } })
      const button = wrapper.get('button.vs__open-indicator-button')
      const listbox = wrapper.get('[role="listbox"]')
      expect(button.attributes('aria-label')).toBe('Toggle options')
      expect(button.attributes('tabindex')).toBe('-1')
      expect(button.attributes('aria-controls')).toBe(listbox.attributes('id'))
      expect(button.attributes('aria-expanded')).toBe('false')
      // the icon inside is decorative
      expect(wrapper.get('.vs__open-indicator').attributes('aria-hidden')).toBe('true')
    })

    it('toggles the dropdown and moves focus to the input', async () => {
      const wrapper = mount(VueSelect, {
        props: { options: ['a'] },
        attachTo: document.body,
      })
      await press(wrapper.get('.vs__open-indicator-button'))
      expect(wrapper.classes()).toContain('vs--open')
      expect(wrapper.get('.vs__open-indicator-button').attributes('aria-expanded')).toBe('true')
      expect(document.activeElement).toBe(wrapper.get('.vs__search').element)
      await press(wrapper.get('.vs__open-indicator-button'))
      expect(wrapper.classes()).not.toContain('vs--open')
      wrapper.unmount()
    })

    it('takes its label from ariaLabels.toggle', () => {
      const wrapper = mount(VueSelect, {
        props: { options: ['a'], ariaLabels: { toggle: 'Optionen anzeigen' } },
      })
      expect(wrapper.get('.vs__open-indicator-button').attributes('aria-label')).toBe(
        'Optionen anzeigen'
      )
    })

    it('is not rendered in select-only mode, where the field itself toggles', () => {
      const wrapper = mount(VueSelect, { props: { options: ['a'], searchable: false } })
      expect(wrapper.find('.vs__open-indicator-button').exists()).toBe(false)
      expect(wrapper.get('.vs__open-indicator').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('opening', () => {
    it('does not open when the input is focused or clicked', async () => {
      const wrapper = mount(VueSelect, { props: { options: ['a'] } })
      await wrapper.get('.vs__search').trigger('focus')
      await press(wrapper.get('.vs__search'))
      expect(wrapper.classes()).not.toContain('vs--open')
    })

    it('opens on focus with openOnFocus', async () => {
      const wrapper = mount(VueSelect, { props: { options: ['a'], openOnFocus: true } })
      await wrapper.get('.vs__search').trigger('focus')
      expect(wrapper.classes()).toContain('vs--open')
    })

    it('opens on typing', async () => {
      const wrapper = mount(VueSelect, { props: { options: ['apple'] } })
      await wrapper.get('.vs__search').setValue('ap')
      expect(wrapper.classes()).toContain('vs--open')
    })
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
      await press(wrapper.get('.vs__open-indicator-button'))
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
      await press(wrapper.get('.vs__open-indicator-button'))
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

  describe('focus after removing values (keyboard)', () => {
    // Mount with a working v-model loop, as an app would have
    function mountWithModel(props: Record<string, unknown>) {
      // eslint-disable-next-line prefer-const
      let wrapper: ReturnType<typeof mount>
      wrapper = mount(VueSelect, {
        props: {
          ...props,
          'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
      })
      return wrapper
    }

    async function keyboardDeselect(wrapper: ReturnType<typeof mount>, index: number) {
      const button = wrapper.findAll('.vs__deselect')[index]
      ;(button.element as HTMLElement).focus()
      await button.trigger('click')
      await nextTick()
    }

    it('moves focus to the next tag’s deselect button', async () => {
      const wrapper = mountWithModel({ options: ['a', 'b', 'c'], multiple: true, modelValue: ['a', 'b', 'c'] })
      await keyboardDeselect(wrapper, 0)
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Deselect b')
      wrapper.unmount()
    })

    it('moves focus to the previous tag when the last one is removed', async () => {
      const wrapper = mountWithModel({ options: ['a', 'b', 'c'], multiple: true, modelValue: ['a', 'b'] })
      await keyboardDeselect(wrapper, 1)
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Deselect a')
      wrapper.unmount()
    })

    it('moves focus to the input when no tags are left', async () => {
      const wrapper = mountWithModel({ options: ['a'], multiple: true, modelValue: ['a'] })
      await keyboardDeselect(wrapper, 0)
      expect(document.activeElement).toBe(wrapper.get('.vs__search').element)
      wrapper.unmount()
    })

    it('moves focus to the input after clearing', async () => {
      const wrapper = mount(VueSelect, {
        props: { options: ['a'], modelValue: 'a' },
        attachTo: document.body,
      })
      const clear = wrapper.get('.vs__clear')
      ;(clear.element as HTMLElement).focus()
      await clear.trigger('click')
      expect(document.activeElement).toBe(wrapper.get('.vs__search').element)
      wrapper.unmount()
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
