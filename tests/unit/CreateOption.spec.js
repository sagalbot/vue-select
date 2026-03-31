import { describe, expect, it } from 'vitest'
import { selectTag, selectWithProps } from '../helpers.js'

describe('CreateOption When Tagging Is Enabled', () => {
	it('can select the current search text as a string', async () => {
		const Select = selectWithProps({
			taggable: true,
			multiple: true,
			options: ['one', 'two'],
			createOption: () => 'four',
		})

		await selectTag(Select, 'three')
		expect(Select.vm.selectedValue).toEqual(['four'])
	})

	it('can select the current search text as an object', async () => {
		const Select = selectWithProps({
			taggable: true,
			multiple: false,
			modelValue: null,
			options: [],
			label: 'name',
			createOption: (title) => ({ name: title }),
		})

		await selectTag(Select, 'two')

		expect(Select.emitted('update:modelValue')[0]).toEqual([{ name: 'two' }])
	})

	it('omit option when throwing an error', async () => {
		const Select = selectWithProps({
			taggable: true,
			multiple: false,
			modelValue: null,
			options: [],
			label: 'name',
			createOption(value) {
				if (value.includes('@')) {
					return { name: value }
				}

				throw new Error('value does not include an @')
			},
		})

		await selectTag(Select, 'bob')
		expect(Select.emitted('update:modelValue')).toBeUndefined()

		await selectTag(Select, 'bob@example.org')
		expect(Select.emitted('update:modelValue')[0]).toEqual([
			{ name: 'bob@example.org' },
		])
	})
})
