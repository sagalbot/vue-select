import { shallowMount } from '@vue/test-utils'
import VueSelect from '../src/components/Select.vue'

/**
 * Trigger a submit event on the search
 * input with a provided search text.
 *
 * @param {import('@vue/test-utils').VueWrapper} Wrapper
 * @param searchText
 */
export async function searchSubmit(Wrapper, searchText = false) {
	const search = Wrapper.get('input')
	await search.trigger('focus')

	if (searchText) {
		Wrapper.vm.search = searchText
		await Wrapper.vm.$nextTick()
	}

	await search.trigger('keydown.enter')
	await Wrapper.vm.$nextTick()
}

/**
 * Focus the input, enter some search text, hit return.
 * @param {import('@vue/test-utils').VueWrapper} Wrapper
 * @param searchText
 * @return {Promise<void>}
 */
export async function selectTag(Wrapper, searchText) {
	Wrapper.vm.$refs.search.focus()
	await Wrapper.vm.$nextTick()

	Wrapper.vm.search = searchText
	await Wrapper.vm.$nextTick()

	Wrapper.get('input').trigger('keydown.enter')
	await Wrapper.vm.$nextTick()
}

/**
 * Create a new VueSelect instance with
 * a provided set of props.
 * @param {Record<string, unknown>} props
 * @return {import('@vue/test-utils').VueWrapper}
 */
export function selectWithProps(props = {}) {
	return shallowMount(VueSelect, { props })
}

/**
 * Returns a Wrapper with a v-select component.
 * @param {Record<string, unknown>} props
 * @param {Record<string, unknown>} options
 * @return {import('@vue/test-utils').VueWrapper}
 */
export function mountDefault(props = {}, options = {}) {
	return shallowMount(VueSelect, {
		props: {
			options: ['one', 'two', 'three'],
			...props,
		},
		...options,
	})
}
