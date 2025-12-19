import { nextTick } from "vue"
import { shallowMount } from '@vue/test-utils'
import VueSelect from '../../src/components/Select.vue'
import { mountDefault, mountWithoutTestUtils } from '../helpers'
import typeAheadMixin from '../../src/mixins/typeAheadPointer'

describe('Moving the Typeahead Pointer', () => {
  it('should set the pointer to zero when the filteredOptions watcher is called', async () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['one', 'two', 'three'] },
      sync: false,
    })

    Select.vm.search = 'one'

    await nextTick()
    expect(Select.vm.typeAheadPointer).toEqual(0)
  })

  it('should move the pointer visually up the list on up arrow keyUp', () => {
    const Select = mountDefault()

    Select.vm.open = true
    Select.vm.typeAheadPointer = 1

    Select.find('.vs__search').trigger('keydown.up')

    expect(Select.vm.typeAheadPointer).toEqual(0)
  })

  it('should move the pointer visually down the list on down arrow keyUp', () => {
    const Select = mountDefault()

    Select.vm.open = true
    Select.vm.typeAheadPointer = 1

    Select.find('.vs__search').trigger('keydown.down')

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('should not move the pointer past the end of the list', () => {
    const Select = mountDefault()

    Select.vm.typeAheadPointer = 2
    Select.vm.typeAheadDown()
    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('will set the pointer to the selected option when opening', async () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: 'three',
        options: ['one', 'two', 'three'],
      },
    })

    Select.find('.vs__search').trigger('focus')
    await nextTick()

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('will set the pointer to the reduced selected option when opening', async () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: 3,
        reduce: (option) => option.value,
        options: [
          { label: 'one', value: 1 },
          { label: 'two', value: 2 },
          { label: 'three', value: 3 },
        ],
      },
    })

    Select.find('.vs__search').trigger('focus')
    await nextTick()

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })
})

it('should not move the pointer visually up the list on up arrow keyUp when dropdown is not open', () => {
  const Select = mountDefault()

  Select.vm.typeAheadPointer = 1

  Select.find('.vs__search').trigger('keydown.up')

  expect(Select.vm.typeAheadPointer).toEqual(1)
})

it('should not move the pointer visually down the list on down arrow keyUp when dropdown is not open', () => {
  const Select = mountDefault()

  Select.vm.typeAheadPointer = 1

  Select.find('.vs__search').trigger('keydown.down')

  expect(Select.vm.typeAheadPointer).toEqual(1)
})
