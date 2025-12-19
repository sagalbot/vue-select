import { nextTick, h } from "vue"
import { selectWithProps } from '../helpers'

describe('Components API', () => {
  it('swap the Deselect component', () => {
    const Deselect = {
      render() {
        return h('button', 'remove')
      },
    }

    const Select = selectWithProps({ components: { Deselect } })

    expect(Select.findComponent(Deselect)).toBeTruthy()
  })

  it('swap the OpenIndicator component', () => {
    const OpenIndicator = {
      render() {
        return h('i', '^')
      },
    }

    const Select = selectWithProps({ components: { OpenIndicator } })

    expect(Select.findComponent(OpenIndicator)).toBeTruthy()
  })
})
