import { defineComponent } from 'vue'
import { selectWithProps } from '../helpers'

describe('Components API', () => {
  it('swap the Deselect component', () => {
    const Deselect = defineComponent('Deselect', {
      render(createElement) {
        return createElement('button', 'remove')
      },
    })

    const Select = selectWithProps({ components: { Deselect } })

    expect(Select.find(Deselect)).toBeTruthy()
  })

  it('swap the OpenIndicator component', () => {
    const OpenIndicator = defineComponent('OpenIndicator', {
      render(createElement) {
        return createElement('i', '^')
      },
    })

    const Select = selectWithProps({ components: { OpenIndicator } })

    expect(Select.find(OpenIndicator)).toBeTruthy()
  })
})
