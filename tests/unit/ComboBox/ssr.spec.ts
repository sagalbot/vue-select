import { describe, it, expect, vi, afterEach } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'

const options = ['one', 'two']

const App = {
  render: () =>
    h(ComboBox, { options, open: true }, () => [
      h(ComboBoxInput),
      h(ComboBoxMenu, () =>
        options.map((value, index) =>
          h(ComboBoxOption, { value, index, key: value }, () => value),
        ),
      ),
    ]),
}

describe('ComboBox SSR', () => {
  afterEach(() => vi.restoreAllMocks())

  it('hydrates without id mismatches', async () => {
    const html = await renderToString(createSSRApp(App))
    expect(html).toContain('role="listbox"')

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    const container = document.createElement('div')
    container.innerHTML = html
    createSSRApp(App).mount(container)

    const messages = [...warn.mock.calls, ...error.mock.calls].flat().join('\n')
    expect(messages).not.toMatch(/hydration/i)
  })

  it('gives each instance on a page unique ids', async () => {
    const Two = { render: () => [h(App), h(App)] }
    const html = await renderToString(createSSRApp(Two))
    const ids = [...html.matchAll(/id="([^"]+)-listbox"/g)].map((m) => m[1])
    expect(ids).toHaveLength(2)
    expect(ids[0]).not.toBe(ids[1])
  })
})
