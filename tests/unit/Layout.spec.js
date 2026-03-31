import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VueSelect from '../../src/components/Select.vue'

describe('Single value options', () => {
	it('should reset the search input on focus lost', () => {
		const Select = shallowMount(VueSelect)
		Select.vm.open = true

		Select.vm.search = 't'
		expect(Select.vm.search).toEqual('t')

		Select.vm.onSearchBlur()
		expect(Select.vm.search).toEqual('')
	})

	it('should not reset the search input on focus lost when clearSearchOnSelect is false', () => {
		const Select = shallowMount(VueSelect, {
			props: { modelValue: 'foo', clearSearchOnSelect: false },
		})

		expect(Select.vm.clearSearchOnSelect).toEqual(false)

		Select.vm.open = true
		Select.vm.search = 't'
		expect(Select.vm.search).toEqual('t')

		Select.vm.onSearchBlur()
		expect(Select.vm.search).toEqual('t')
	})
})
