import Vue from 'vue'
import { selectWithProps } from '../helpers'

describe('Components API', () => {
  it('swap the Deselect component', () => {
    const Deselect = Vue.component('Deselect', {
      render(createElement) {
        return createElement('button', 'remove')
      },
    })

    const Select = selectWithProps({ components: { Deselect } })

    expect(Select.findComponent(Deselect)).toBeTruthy()
  })

  it('swap the OpenIndicator component', () => {
    const OpenIndicator = Vue.component('OpenIndicator', {
      render(createElement) {
        return createElement('i', '^')
      },
    })

    const Select = selectWithProps({ components: { OpenIndicator } })

    expect(Select.findComponent(OpenIndicator)).toBeTruthy()
  })
})
