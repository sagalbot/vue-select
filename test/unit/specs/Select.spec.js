// flow
/* global describe, it, expect */

import Vue from 'vue'
import vSelect from 'src/components/Select.vue'
import pointerScroll from 'src/mixins/pointerScroll.js'
Vue.config.productionTip = false
//  http://vue-loader.vuejs.org/en/workflow/testing-with-mocks.html
const Mock = require('!!vue?inject!src/components/Select.vue')

Vue.component('v-select', vSelect)

/**
 * Simulate a DOM event.
 * @param target
 * @param event
 * @param process
 * @returns {Event}
 */
function trigger(target, event, process) {
	var e = document.createEvent('HTMLEvents')
	e.initEvent(event, true, true)
	if (process) process(e)
	target.dispatchEvent(e)
	return e
}

/**
 * Simulate a Mouse event.
 * @param target
 * @param event
 * @param process
 * @returns {Event}
 */
function triggerMouse(target, event, process) {
	var e = document.createEvent('MouseEvent')
	e.initEvent('event', true, true)
	if (process) process(e)
	target.dispatchEvent(e)
	return e
}

/**
 * Simulate a Focus event.
 * @param target
 * @param event
 * @param process
 * @returns {Event}
 */
function triggerFocusEvent(target, event, process) {
	var e = document.createEvent('FocusEvent')
	e.initEvent('event', true, true)
	if (process) process(e)
	target.dispatchEvent(e)
	return e
}

/**
 * Optionally set the search term, then simulate a return keypress.
 * @param vm
 * @param search
 */
function searchSubmit(vm, search = false) {
	if (search) {
		vm.$children[0].search = search
	}

	trigger(vm.$children[0].$refs.search, 'keydown', function (e) {
		e.keyCode = 13
	})
}

describe('Select.vue', () => {

	describe('Selecting values', () => {
		it('can accept an array with pre-selected values', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()
			expect(vm.$children[0].mutableValue).toEqual(vm.value)
		})

		it('can accept an array of objects and pre-selected value (single)', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: {label: 'This is Foo', value: 'foo'},
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			expect(vm.$children[0].mutableValue).toEqual(vm.value)
		})

		it('can accept an array of objects and pre-selected values (multiple)', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}],
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			expect(vm.$children[0].mutableValue).toEqual(vm.value)
		})

    it('can select an option on tab', (done) => {
      const vm = new Vue({
        template: `<div><v-select :options="['one','two']" select-on-tab></v-select></div>`,
        components: {vSelect},
      }).$mount()

      vm.$children[0].typeAheadPointer = 0

      trigger(vm.$children[0].$refs.search, 'keydown', (e) => e.keyCode = 9)

      Vue.nextTick(() => {
        expect(vm.$children[0].mutableValue).toEqual('one');
        done();
      })
    })

		it('can deselect a pre-selected object', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true"></v-select></div>',
				data: {
					value: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}],
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			vm.$children[0].deselect({label: 'This is Foo', value: 'foo'})
			expect(vm.$children[0].mutableValue.length).toEqual(1)
		})

		it('can deselect a pre-selected string', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true"></v-select></div>',
				data: {
					value: ['foo', 'bar'],
					options: ['foo','bar']
				}
			}).$mount()
			vm.$children[0].deselect('foo')
			expect(vm.$children[0].mutableValue.length).toEqual(1)
		}),

		it('can deselect an option when multiple is false', () => {
			const vm = new Vue({
				template: `<div><v-select :value="'foo'"></v-select></div>`,
			}).$mount()
			vm.$children[0].deselect('foo')
			expect(vm.$children[0].mutableValue).toEqual(null)
		})

		it('can determine if the value prop is empty', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [],
					options: ['one', 'two', 'three']
				}
			}).$mount()
			var select = vm.$children[0]
			expect(select.isValueEmpty).toEqual(true)

			select.select(['one'])
			expect(select.isValueEmpty).toEqual(false)

			select.select([{l: 'f'}])
			expect(select.isValueEmpty).toEqual(false)

			select.select('one')
			expect(select.isValueEmpty).toEqual(false)

			select.select({label: 'foo', value: 'foo'})
			expect(select.isValueEmpty).toEqual(false)

			select.select('')
			expect(select.isValueEmpty).toEqual(true)

			select.select(null)
			expect(select.isValueEmpty).toEqual(true)
		})

		it('should reset the selected values when the multiple property changes', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="multiple"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					multiple: true,
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.multiple = false

			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(null)
				vm.multiple = true
				Vue.nextTick(() => {
					expect(vm.$children[0].mutableValue).toEqual([])
					done()
				})
			})
		})

		it('can retain values present in a new array of options', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.options = ['one', 'five', 'six']
			expect(vm.$children[0].mutableValue).toEqual(['one'])
		})

		it('can determine if an object is already selected', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" multiple v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			expect(vm.$children[0].isOptionSelected({label: 'one'})).toEqual(true)
		})

		it('can use v-model syntax for a two way binding to a parent component', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: 'foo',
					options: ['foo','bar','baz']
				}
			}).$mount()

			expect(vm.$children[0].value).toEqual('foo')
			expect(vm.$children[0].mutableValue).toEqual('foo')

			vm.$children[0].mutableValue = 'bar'

			Vue.nextTick(() => {
				expect(vm.value).toEqual('bar')
				done()
			})
		}),

		it('can check if a string value is selected when the value is an object and multiple is true', () => {
			const vm = new Vue({
				template: `<div><v-select multiple :value="[{label: 'foo', value: 'bar'}]"></v-select></div>`,
			}).$mount()
			expect(vm.$children[0].isOptionSelected('foo')).toEqual(true)
		}),

		describe('change Event', () => {
			it('will trigger the input event when the selection changes', (done) => {
				const vm = new Vue({
					template: `<div><v-select ref="select"  :value="['foo']" :options="['foo','bar','baz']" v-on:input="foo = arguments[0]"></v-select></div>`,
					data: {
						foo: ''
					}
				}).$mount()

				vm.$refs.select.select('bar')

				Vue.nextTick(() => {
					expect(vm.foo).toEqual('bar')
					done()
				})
			})

			it('should run change when multiple is true and the value changes', (done) => {
				const vm = new Vue({
					template: `<div><v-select ref="select" :value="['foo']" :options="['foo','bar','baz']" multiple v-on:input="foo = arguments[0]"></v-select></div>`,
					data: {
						foo: ''
					}
				}).$mount()

				vm.$refs.select.select('bar')

				Vue.nextTick(() => {
					expect(vm.foo).toEqual(['foo','bar'])
					done()
				})

			})
		})
	})

	describe('Filtering Options', () => {
		it('should filter an array of strings', () => {
			const vm = new Vue({
				template: `<div><v-select ref="select" :options="['foo','bar','baz']" v-model="value"></v-select></div>`,
				data: {value: 'foo'}
			}).$mount()
			vm.$refs.select.search = 'ba'
			expect(vm.$refs.select.filteredOptions).toEqual(['bar','baz'])
		})

		it('should not filter the array of strings if filterable is false', () => {
			const vm = new Vue({
				template: `<div><v-select ref="select" :filterable="false" :options="['foo','bar','baz']" v-model="value"></v-select></div>`,
				data: {value: 'foo'}
			}).$mount()
			vm.$refs.select.search = 'ba'
			expect(vm.$refs.select.filteredOptions).toEqual(['foo','bar','baz'])
		})

		it('should filter without case-sensitivity', () => {
			const vm = new Vue({
				template: `<div><v-select ref="select" :options="['Foo','Bar','Baz']" v-model="value"></v-select></div>`,
				data: {value: 'foo'}
			}).$mount()
			vm.$refs.select.search = 'ba'
			expect(vm.$refs.select.filteredOptions).toEqual(['Bar','Baz'])
		})

		it('can filter an array of objects based on the objects label key', () => {
			const vm = new Vue({
				template: `<div><v-select ref="select" :options="[{label: 'Foo', value: 'foo'}, {label: 'Bar', value: 'bar'}, {label: 'Baz', value: 'baz'}]" v-model="value"></v-select></div>`,
				data: {value: 'foo'}
			}).$mount()
			vm.$refs.select.search = 'ba'
			expect(JSON.stringify(vm.$refs.select.filteredOptions)).toEqual(JSON.stringify([{label: 'Bar', value: 'bar'}, {label: 'Baz', value: 'baz'}]))
		})

		it('can determine if a given option should match the current search text', () => {
			const vm = new Vue({
				template: `<div><v-select ref="select" :filter-by="customFn" :options="[{label: 'Aoo', value: 'foo'}, {label: 'Bar', value: 'bar'}, {label: 'Baz', value: 'baz'}]" v-model="value"></v-select></div>`,
				data: {value: 'foo'},
				methods:{
					customFn: (option, label, search) => label.match(new RegExp('^' + search, 'i'))
				}
			}).$mount()
			vm.$refs.select.search = 'a'
			expect(JSON.stringify(vm.$refs.select.filteredOptions)).toEqual(JSON.stringify([{label: 'Aoo', value: 'foo'}]))
		})

		it('can use a custom filtering method', () => {
      const vm = new Vue({
        template: `<div><v-select ref="select" :filter="customFn" :options="options" v-model="value"></v-select></div>`,
        data: {
        	options: ['foo','bar','baz'],
        	value: 'foo'
				},
        methods:{
          customFn(options, search, vm) {
          	return options.filter(option => option.indexOf(search) > 0)
					}
        }
      }).$mount()
      vm.$refs.select.search = 'a'
      expect(JSON.stringify(vm.$refs.select.filteredOptions)).toEqual(JSON.stringify(['bar','baz']))
		})

		it('can filter arrays of numbers', () => {
      const vm = new Vue({
        template: `<div><v-select ref="select" :options="options"></v-select></div>`,
        data: {
        	options: [1,5,10],
        	value: 'foo'
				},
      }).$mount()
      vm.$refs.select.search = '5'
      expect(JSON.stringify(vm.$refs.select.filteredOptions)).toEqual(JSON.stringify([5]))
		})
	})

	describe('Toggling Dropdown', () => {
		it('should not open the dropdown when the el is clicked but the component is disabled', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" disabled></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			vm.$children[0].toggleDropdown({target: vm.$children[0].$refs.search})
			Vue.nextTick(() => {
				Vue.nextTick(() => {
					expect(vm.$children[0].open).toEqual(false)
					done()
				})
			})
		})

		it('should open the dropdown when the el is clicked', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			vm.$children[0].toggleDropdown({target: vm.$children[0].$refs.search})
			Vue.nextTick(() => {
				Vue.nextTick(() => {
					expect(vm.$children[0].open).toEqual(true)
					done()
				})
			})
		})

		it('should open the dropdown when the selected tag is clicked', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			const selectedTag = vm.$children[0].$el.getElementsByClassName('selected-tag')[0]
			vm.$children[0].toggleDropdown({target: selectedTag})
			Vue.nextTick(() => {
				Vue.nextTick(() => {
					expect(vm.$children[0].open).toEqual(true)
					done()
				})
			})
		})

		it('can close the dropdown when the el is clicked', (done) => {
			const vm = new Vue({
				template: '<div><v-select></v-select></div>',
				components: {vSelect},
			}).$mount()

			spyOn(vm.$children[0].$refs.search, 'blur')

			vm.$children[0].open = true
			vm.$children[0].toggleDropdown({target: vm.$children[0].$el})

			Vue.nextTick(() => {
				expect(vm.$children[0].$refs.search.blur).toHaveBeenCalled()
				done()
			})
		})


		it('closes the dropdown when an option is selected, multiple is true, and closeOnSelect option is true', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" multiple :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [],
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].open = true
			vm.$refs.select.select('one')

			Vue.nextTick(() => {
				expect(vm.$children[0].open).toEqual(false)
				done()
			})
		})

		it('does not close the dropdown when the el is clicked, multiple is true, and closeOnSelect option is false', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" multiple :closeOnSelect="false" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [],
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].open = true
			vm.$refs.select.select('one')

			Vue.nextTick(() => {
				expect(vm.$children[0].open).toEqual(true)
				done()
			})
		})


		it('should close the dropdown on search blur', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" multiple :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			vm.$children[0].open = true
			triggerFocusEvent(vm.$children[0].$refs.toggle, 'blur')
			expect(vm.$children[0].open).toEqual(true)
		})

		it('will close the dropdown and emit the search:blur event from onSearchBlur', () => {
			const vm = new Vue({
				template: '<div><v-select></v-select></div>',
			}).$mount()

			spyOn(vm.$children[0], '$emit')
			vm.$children[0].open = true
			vm.$children[0].onSearchBlur()

			expect(vm.$children[0].open).toEqual(false)
			expect(vm.$children[0].$emit).toHaveBeenCalledWith('search:blur')
		})

		it('will open the dropdown and emit the search:focus event from onSearchFocus', () => {
			const vm = new Vue({
				template: '<div><v-select></v-select></div>',
			}).$mount()

			spyOn(vm.$children[0], '$emit')
			vm.$children[0].onSearchFocus()

			expect(vm.$children[0].open).toEqual(true)
			expect(vm.$children[0].$emit).toHaveBeenCalledWith('search:focus')
		})

		it('will close the dropdown on escape, if search is empty', (done) => {
			const vm = new Vue({
				template: '<div><v-select></v-select></div>',
				components: {vSelect},
			}).$mount()

			spyOn(vm.$children[0].$refs.search, 'blur')

			vm.$children[0].open = true
			vm.$children[0].onEscape()

			Vue.nextTick(() => {
				expect(vm.$children[0].$refs.search.blur).toHaveBeenCalled()
				done()
			})
		})

		it('should remove existing search text on escape keyup', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" multiple :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			vm.$children[0].search = 'foo'
			vm.$children[0].onEscape()
			expect(vm.$children[0].search).toEqual('')
		})

		it('should have an open class when dropdown is active', () => {
			const vm = new Vue({
				template: '<div><v-select></v-select></div>',
				components: {vSelect}
			}).$mount()

			expect(vm.$children[0].dropdownClasses.open).toEqual(false)
		})
	})

	describe('Moving the Typeahead Pointer', () => {
		it('should set the pointer to zero when the filteredOptions change', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options"></v-select></div>',
				components: {vSelect},
				data: {
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].search = 'two'
			Vue.nextTick(() => {
				expect(vm.$children[0].typeAheadPointer).toEqual(0)
				done()
			})
		})

		it('should move the pointer visually up the list on up arrow keyDown', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options"></v-select></div>',
				components: {vSelect},
				data: {
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].typeAheadPointer = 1

			trigger(vm.$children[0].$refs.search, 'keydown', (e) => e.keyCode = 38)
			expect(vm.$children[0].typeAheadPointer).toEqual(0)
		})

		it('should move the pointer visually down the list on down arrow keyDown', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options"></v-select></div>',
				components: {vSelect},
				data: {
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].typeAheadPointer = 1
			trigger(vm.$children[0].$refs.search, 'keydown', (e) => e.keyCode = 40)
			expect(vm.$children[0].typeAheadPointer).toEqual(2)
		})

		it('should not move the pointer past the end of the list', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options"></v-select></div>',
				components: {vSelect},
				data: {
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].typeAheadPointer = 2
			vm.$children[0].typeAheadDown()
			expect(vm.$children[0].typeAheadPointer).toEqual(2)
		})

		describe('Automatic Scrolling', () => {
			it('should check if the scroll position needs to be adjusted on up arrow keyDown', () => {
				const vm = new Vue({
					template: '<div><v-select :options="options"></v-select></div>',
					components: {vSelect},
					data: {
						options: ['one', 'two', 'three']
					}
				}).$mount()

				vm.$children[0].typeAheadPointer = 1
				spyOn(vm.$children[0], 'maybeAdjustScroll')
				trigger(vm.$children[0].$refs.search, 'keydown', (e) => e.keyCode = 38)
				expect(vm.$children[0].maybeAdjustScroll).toHaveBeenCalled()
			})

			it('should check if the scroll position needs to be adjusted on down arrow keyDown', () => {
				const vm = new Vue({
					template: '<div><v-select :options="options"></v-select></div>',
					components: {vSelect},
					data: {
						options: ['one', 'two', 'three']
					}
				}).$mount()

				spyOn(vm.$children[0], 'maybeAdjustScroll')
				trigger(vm.$children[0].$refs.search, 'keydown', (e) => e.keyCode = 40)
				expect(vm.$children[0].maybeAdjustScroll).toHaveBeenCalled()
			})

			it('should check if the scroll position needs to be adjusted when filtered options changes', (done) => {
				const vm = new Vue({
					template: '<div><v-select :options="options"></v-select></div>',
					components: {vSelect},
					data: {
						options: ['one', 'two', 'three']
					}
				}).$mount()

				spyOn(vm.$children[0], 'maybeAdjustScroll')
				vm.$children[0].search = 'two'

				Vue.nextTick(() => {
					expect(vm.$children[0].maybeAdjustScroll).toHaveBeenCalled()
					done()
				})
			})

			it('should scroll up if the pointer is above the current viewport bounds', () => {
				let methods = Object.assign(pointerScroll.methods, {
					pixelsToPointerTop() {
						return 1
					},
					viewport() {
						return {top: 2, bottom: 0}
					}
				})
				const vm = new Vue({
					template: '<div><v-select :options="[\'one\', \'two\', \'three\']"></v-select></div>',
					components: {
						'v-select': Mock({
							'../mixins/pointerScroll': {methods}
						})
					},
				}).$mount()

				spyOn(vm.$children[0], 'scrollTo')
				vm.$children[0].maybeAdjustScroll()
				expect(vm.$children[0].scrollTo).toHaveBeenCalledWith(1)
			})

			/**
			 * @link 	https://github.com/vuejs/vue-loader/issues/434
			 * @todo 	vue-loader/inject-loader fails when used twice in the same file,
			 *        so the mock here is abastracted to a separate file.
			 */
			xit('should scroll down if the pointer is below the current viewport bounds', () => {
				let methods = Object.assign(pointerScroll.methods, {
				  pixelsToPointerBottom() {
				    return 2
				  },
				  viewport() {
				    return {top: 0, bottom: 1}
				  }
				})
				const vm = new Vue({
					template: `<div><v-select :options="['one', 'two', 'three']"></v-select></div>`,
					components: {
					  'v-select': Mock({
					    '../mixins/pointerScroll': {methods}
					  })
					},
				}).$mount()

				spyOn(vm.$children[0], 'scrollTo')
				vm.$children[0].maybeAdjustScroll()
				expect(vm.$children[0].scrollTo).toHaveBeenCalledWith(vm.$children[0].viewport().top + vm.$children[0].pointerHeight())
			})
		})

		describe('Measuring pixel distances', () => {
			it('should calculate pointerHeight as the offsetHeight of the pointer element if it exists', () => {
				const vm = new Vue({
					template: `<div><v-select :options="['one', 'two', 'three']"></v-select></div>`,
				}).$mount()

				// dropdown must be open for $refs to exist
				vm.$children[0].open = true

				Vue.nextTick(() => {
					//  Fresh instances start with the pointer at -1
					vm.$children[0].typeAheadPointer = -1
					expect(vm.$children[0].pointerHeight()).toEqual(0)

					vm.$children[0].typeAheadPointer = 100
					expect(vm.$children[0].pointerHeight()).toEqual(0)

					vm.$children[0].typeAheadPointer = 1
					expect(vm.$children[0].pointerHeight()).toEqual(vm.$children[0].$refs.dropdownMenu.children[1].offsetHeight)
				})
			})
		})
	})

	describe('Removing values', () => {
		it('can remove the given tag when its close icon is clicked', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" v-model="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].$refs.toggle.querySelector('.close').click()
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual([])
				done()
			})
		})

		it('should not remove tag when close icon is clicked and component is disabled', (done) => {
			const vm = new Vue({
				template: '<div><v-select disabled multiple :options="options" v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].$refs.toggle.querySelector('.close').click()
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(['one'])
				done()
			})
		})

		it('should remove the last item in the value array on delete keypress when multiple is true', () => {

			const vm = new Vue({
				template: '<div><v-select :options="options" v-model="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one', 'two'],
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].maybeDeleteValue()
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(['one'])
			})
		})

		it('should set value to null on delete keypress when multiple is false', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].maybeDeleteValue()
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(null)
			})
		})
	})

	describe('Labels', () => {
		it('can generate labels using a custom label key', () => {
			const vm = new Vue({
				template: '<div><v-select label="name" :options="options" v-model="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: [{name: 'Baz'}],
					options: [{name: 'Foo'}, {name: 'Baz'}]
				}
			}).$mount()
			expect(vm.$children[0].$refs.toggle.querySelector('.selected-tag').textContent).toContain('Baz')
		})

		it('will console.warn when options contain objects without a valid label key', (done) => {
			spyOn(console, 'warn')
			const vm = new Vue({
				template: '<div><v-select :options="[{}]"></v-select></div>',
			}).$mount()
			vm.$children[0].open = true
			Vue.nextTick(() => {
				expect(console.warn).toHaveBeenCalledWith(
						'[vue-select warn]: Label key "option.label" does not exist in options object {}.' +
						'\nhttp://sagalbot.github.io/vue-select/#ex-labels'
				)
				done()
			})
		})

		it('should display a placeholder if the value is empty', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" placeholder="foo"></v-select></div>',
				components: {vSelect},
				data: {
					options: [{label: 'one'}]
				}
			}).$mount()

			expect(vm.$children[0].searchPlaceholder).toEqual('foo')
			vm.$children[0].mutableValue = {label: 'one'}
			Vue.nextTick(() => {
				expect(vm.$children[0].searchPlaceholder).not.toBeDefined()
				done()
			})
		})
	})

	describe('When index prop is defined', () => {
		it('can accept an array of objects and pre-selected value (single)', () => {
			const vm = new Vue({
				template: '<div><v-select :index="index" :options="options" :value="value"></v-select></div>',
				components: {vSelect},
				data: {
					index: 'value',
					value: 'foo',
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			expect(vm.$children[0].mutableValue).toEqual(vm.value)
		})

    it('can determine if an object is pre-selected', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" v-model="value" index="id"></v-select></div>',
        components: {vSelect},
        data: {
          value: 'foo',
          options: [{
          	id: 'foo',
						label: 'This is Foo'
					}]
        }
      }).$mount()

      expect(vm.$children[0].isOptionSelected({
        id: 'foo',
        label: 'This is Foo'
      })).toEqual(true)
    })

    it('can determine if an object is selected after it has been chosen', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" index="id"></v-select></div>',
        components: {vSelect},
				data: {
        	options: [{id: 'foo', label: 'FooBar'}]
				}
      }).$mount()

			vm.$children[0].select({id: 'foo', label: 'FooBar'});

      // Vue.nextTick(() => {
        expect(vm.$children[0].isOptionSelected({
          id: 'foo',
          label: 'This is Foo'
        })).toEqual(true)
				// done()
			// })
    })

		it('can accept an array of objects and pre-selected values (multiple)', () => {
			const vm = new Vue({
				template: '<div><v-select :index="index" :options="options" :value="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					index: 'value',
					value: ['foo', 'bar'],
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			expect(vm.$children[0].mutableValue).toEqual(vm.value)
		})

		it('can deselect a pre-selected object', () => {
			const vm = new Vue({
				template: '<div><v-select :index="index" :options="options" :value="value" :multiple="true"></v-select></div>',
				data: {
					index: 'value',
					value: ['foo', 'bar'],
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			vm.$children[0].deselect('foo')
			expect(vm.$children[0].mutableValue.length).toEqual(1)
			expect(vm.$children[0].mutableValue).toEqual(['bar'])
		})

		it('can deselect an option when multiple is false', () => {
			const vm = new Vue({
				template: `<div><v-select :index="index" :options="options" :value="value"></v-select></div>`,
				data: {
					index: 'value',
					value: 'foo',
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
				}
			}).$mount()
			vm.$children[0].deselect('foo')
			expect(vm.$children[0].mutableValue).toEqual(null)
		})

		it('can use v-model syntax for a two way binding to a parent component', (done) => {
			const vm = new Vue({
				template: '<div><v-select :index="index" :options="options" v-model="value"></v-select></div>',
				components: {vSelect},
				data: {
					index: 'value',
					value: 'foo',
					options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}, {label: 'This is Baz', value: 'baz'}]
				}
			}).$mount()

			expect(vm.$children[0].value).toEqual('foo')
			expect(vm.$children[0].mutableValue).toEqual('foo')

			vm.$children[0].mutableValue = 'bar'

			Vue.nextTick(() => {
				expect(vm.value).toEqual('bar')
				done()
			})
		}),

    it('can work with an array of integers', () => {
      const vm = new Vue({
        template: '<div><v-select :options="[1,2,3,4,5]" v-model="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: 5,
        }
      }).$mount()

      expect(vm.$children[0].isOptionSelected(5)).toEqual(true)
      expect(vm.$children[0].isValueEmpty).toEqual(false)
    })

		it('can generate labels using a custom label key', () => {
			const vm = new Vue({
				template: '<div><v-select :index="index" label="name" :options="options" v-model="value" :multiple="true"></v-select></div>',
				components: {vSelect},
				data: {
					index: 'value',
					value: ['baz'],
					options: [{value: 'foo', name: 'Foo'}, {value: 'baz', name: 'Baz'}]
				}
			}).$mount()
			expect(vm.$children[0].$refs.toggle.querySelector('.selected-tag').textContent).toContain('Baz')
		})

    it('will console.warn when attempting to select an option with an undefined index', () => {
      spyOn(console, 'warn')

      const vm = new Vue({
        template: '<div><v-select index="value" :options="options"></v-select></div>',
        data: {
          options: [{label: 'Foo'}]
        }
      }).$mount()
      vm.$children[0].select({label: 'Foo'})
      expect(console.warn).toHaveBeenCalledWith(
          `[vue-select warn]: Index key "option.value" does not exist in options object {"label":"Foo"}.`
      )
    })

		it('can find the original option within this.options', () => {
      const vm = new Vue({
        template: '<div><v-select index="id" :options="options"></v-select></div>',
        data: {
          options: [{id: 1, label: 'Foo'},{id:2, label: 'Bar'}]
        }
      }).$mount()

			expect(vm.$children[0].findOptionByIndexValue(1)).toEqual({id: 1, label: 'Foo'})
			expect(vm.$children[0].findOptionByIndexValue({id: 1, label: 'Foo'})).toEqual({id: 1, label: 'Foo'})
		})

		describe('And when option[index] is a nested object', () => {
			it('can determine if an object is pre-selected', () => {
        const nestedOption = {
          value: {
            nested: true
          },
          label: 'foo'
        };
        const vm = new Vue({
          template: '<div><v-select index="value" :options="options" :value="value"></v-select></div>',
          components: {vSelect},
          data: {
            value: {
              nested: true
            },
            options: [nestedOption]
          }
        }).$mount()
        expect(vm.$children[0].isOptionSelected({
          nested: true
        })).toEqual(true)
			})

			it('can determine if an object is selected after it is chosen', () => {
        const nestedOption = {
          value: {
            nested: true
          },
          label: 'foo'
        };
        const vm = new Vue({
          template: '<div><v-select index="value" :options="options"></v-select></div>',
          components: {vSelect},
          data: {
            options: [nestedOption]
          }
        }).$mount()
				vm.$children[0].select(nestedOption)
        expect(vm.$children[0].isOptionSelected(nestedOption)).toEqual(true)
			})

      it('can determine a selected values label', () => {
        const nestedOption = {
          value: {
            nested: true
          },
          label: 'foo'
        };
        const vm = new Vue({
          template: '<div><v-select index="value" :options="options" :value="value"></v-select></div>',
          components: {vSelect},
          data: {
            value: {
              nested: true
            },
            options: [nestedOption]
          }
        }).$mount()

        expect(vm.$children[0].getOptionLabel({
          nested: true
        })).toEqual('foo')
      })

		})
	})

	describe('When Tagging Is Enabled', () => {
		it('can determine if a given option string already exists', () => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" taggable></v-select></div>',
				components: {vSelect},
				data: {
					options: ['one', 'two']
				}
			}).$mount()

			expect(vm.$refs.select.optionExists('one')).toEqual(true)
			expect(vm.$refs.select.optionExists('three')).toEqual(false)
		})

		it('can determine if a given option object already exists', () => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" taggable></v-select></div>',
				components: {vSelect},
				data: {
					options: [{label: 'one'}, {label: 'two'}]
				}
			}).$mount()

			expect(vm.$refs.select.optionExists('one')).toEqual(true)
			expect(vm.$refs.select.optionExists('three')).toEqual(false)
		})

		it('can determine if a given option object already exists when using custom labels', () => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" label="foo" taggable></v-select></div>',
				components: {vSelect},
				data: {
					options: [{foo: 'one'}, {foo: 'two'}]
				}
			}).$mount()

			expect(vm.$refs.select.optionExists('one')).toEqual(true)
			expect(vm.$refs.select.optionExists('three')).toEqual(false)
		})

		it('can add the current search text as the first item in the options list', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			vm.$children[0].search = 'three'
			expect(vm.$children[0].filteredOptions).toEqual(['three'])
		})

		it('can select the current search text as a string', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			searchSubmit(vm, 'three')
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(['one', 'three'])
				done()
			})
		})

		it('can select the current search text as an object', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()

			searchSubmit(vm, 'two')
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual([{label: 'one'}, {label: 'two'}])
				done()
			})
		})

		it('should add a freshly created option/tag to the options list when pushTags is true', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" push-tags :value="value" :multiple="true" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			searchSubmit(vm, 'three')
			expect(vm.$children[0].mutableOptions).toEqual(['one', 'two', 'three'])
		})

		it('should add a freshly created option/tag to the options list when pushTags is true and filterable is false', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" push-tags :value="value" :filterable="false" :multiple="true" :taggable="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			searchSubmit(vm, 'three')
			expect(vm.$children[0].mutableOptions).toEqual(['one', 'two', 'three'])
			expect(vm.$children[0].filteredOptions).toEqual(['one', 'two', 'three'])
		})

		it('wont add a freshly created option/tag to the options list when pushTags is false', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" :taggable="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			searchSubmit(vm, 'three')
			expect(vm.$children[0].mutableOptions).toEqual(['one', 'two'])
		})

		it('wont add a freshly created option/tag to the options list when pushTags is false and filterable is false', () => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" :filterable="false" :taggable="true"></v-select></div>',
				components: {vSelect},
				data: {
					value: ['one'],
					options: ['one', 'two']
				}
			}).$mount()

			searchSubmit(vm, 'three')
			expect(vm.$children[0].mutableOptions).toEqual(['one', 'two'])
			expect(vm.$children[0].filteredOptions).toEqual(['one', 'two'])
		})

		it('should select an existing option if the search string matches a string from options', (done) => {
			let two = 'two'
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" taggable></v-select></div>',
				data: {
					value: null,
					options: ['one', two]
				}
			}).$mount()
			vm.$children[0].search = 'two'

			searchSubmit(vm)

			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue[0]).toBe(two)
				done()
			})
		})

		it('should select an existing option if the search string matches an objects label from options', (done) => {
			let two = {label: 'two'}
			const vm = new Vue({
				template: '<div><v-select :options="options" taggable></v-select></div>',
				data: {
					options: [{label: 'one'}, two]
				}
			}).$mount()

			vm.$children[0].search = 'two'

			Vue.nextTick(() => {
				searchSubmit(vm)
				//  This needs to be wrapped in nextTick() twice so that filteredOptions can
				//  calculate after setting the search text, and move the typeAheadPointer index to 0.
				Vue.nextTick(() => {
					expect(vm.$children[0].mutableValue.label).toBe(two.label)
					done()
				})
			})
		})

		it('should select an existing option if the search string matches an objects label from options when filter-options is false', (done) => {
			let two = {label: 'two'}
			const vm = new Vue({
				template: '<div><v-select :options="options" taggable :filterable="false"></v-select></div>',
				data: {
					options: [{label: 'one'}, two]
				}
			}).$mount()

			vm.$children[0].search = 'two'

			Vue.nextTick(() => {
				searchSubmit(vm)
				//	This needs to be wrapped in nextTick() twice so that filteredOptions can
				//	calculate after setting the search text, and move the typeAheadPointer index to 0.
				Vue.nextTick(() => {
					expect(vm.$children[0].mutableValue.label).toBe(two.label)
					done()
				})
			})
		})

		it('should not reset the selected value when the options property changes', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()
			vm.$children[0].mutableOptions = [{label: 'two'}]
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual([{label: 'one'}])
				done()
			})
		})

		it('should not reset the selected value when the options property changes when filterable is false', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" :multiple="true" :filterable="false" taggable></v-select></div>',
				components: {vSelect},
				data: {
					value: [{label: 'one'}],
					options: [{label: 'one'}]
				}
			}).$mount()
			vm.$children[0].mutableOptions = [{label: 'two'}]
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual([{label: 'one'}])
				done()
			})
		})

		it('should not allow duplicate tags when using string options', (done) => {
				const vm = new Vue({
					template: `<div><v-select ref="select" taggable multiple></v-select></div>`,
				}).$mount()
				vm.$refs.select.search = 'one'
				searchSubmit(vm)
				Vue.nextTick(() => {
					expect(vm.$refs.select.mutableValue).toEqual(['one'])
					expect(vm.$refs.select.search).toEqual('')
					vm.$refs.select.search = 'one'
					searchSubmit(vm)
					Vue.nextTick(() => {
						expect(vm.$refs.select.mutableValue).toEqual(['one'])
						expect(vm.$refs.select.search).toEqual('')
						done()
					})
				})
		})

		it('should not allow duplicate tags when using object options', (done) => {
				const vm = new Vue({
					template: `<div><v-select ref="select" taggable multiple></v-select></div>`,
				}).$mount()
				vm.$refs.select.search = 'one'
				searchSubmit(vm)
				Vue.nextTick(() => {
					expect(vm.$refs.select.mutableValue).toEqual(['one'])
					expect(vm.$refs.select.search).toEqual('')
					vm.$refs.select.search = 'one'
					searchSubmit(vm)
					Vue.nextTick(() => {
						expect(vm.$refs.select.mutableValue).toEqual(['one'])
						expect(vm.$refs.select.search).toEqual('')
						done()
					})
				})

		})
	})

	describe('Asynchronous Loading', () => {
		it('can toggle the loading class', () => {
			const vm = new Vue({
				template: '<div><v-select ref="select"></v-select></div>',
			}).$mount()

			vm.$refs.select.toggleLoading()
			expect(vm.$refs.select.mutableLoading).toEqual(true)

			vm.$refs.select.toggleLoading(true)
			expect(vm.$refs.select.mutableLoading).toEqual(true)
		})

		it('should trigger the onSearch callback when the search text changes', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :on-search="foo"></v-select></div>',
				data: {
					called: false
				},
				methods: {
					foo(val) {
						this.called = val
					}
				}
			}).$mount()

			vm.$refs.select.search = 'foo'

			Vue.nextTick(() => {
				expect(vm.called).toEqual('foo')
				done()
			})
		})

		it('should not trigger the onSearch callback if the search text is empty', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" search="foo" :on-search="foo"></v-select></div>',
				data: { called: false },
				methods: {
					foo(val) {
						this.called = ! this.called
					}
				}
			}).$mount()

			vm.$refs.select.search = 'foo'
			Vue.nextTick(() => {
				expect(vm.called).toBe(true)
				vm.$refs.select.search = ''
				Vue.nextTick(() => {
					expect(vm.called).toBe(true)
					done()
				})
			})
		})

    it('should trigger the search event when the search text changes', (done) => {
      const vm = new Vue({
        template: '<div><v-select ref="select" @search="foo"></v-select></div>',
        data: {
          called: false
        },
        methods: {
          foo(val) {
            this.called = val
          }
        }
      }).$mount()

      vm.$refs.select.search = 'foo'

      Vue.nextTick(() => {
        expect(vm.called).toEqual('foo')
        done()
      })
    })

    it('should not trigger the search event if the search text is empty', (done) => {
      const vm = new Vue({
        template: '<div><v-select ref="select" search="foo" @search="foo"></v-select></div>',
        data: { called: false },
        methods: {
          foo(val) {
            this.called = ! this.called
          }
        }
      }).$mount()

      vm.$refs.select.search = 'foo'
      Vue.nextTick(() => {
        expect(vm.called).toBe(true)
        vm.$refs.select.search = ''
        Vue.nextTick(() => {
          expect(vm.called).toBe(true)
          done()
        })
      })
    })

		it('can set loading to false from the onSearch callback', (done) => {
			const vm = new Vue({
				template: '<div><v-select loading ref="select" :on-search="foo"></v-select></div>',
				methods: {
					foo(search, loading) {
						loading(false)
					}
				}
			}).$mount()

			vm.$refs.select.search = 'foo'
			Vue.nextTick(() => {
				expect(vm.$refs.select.mutableLoading).toEqual(false)
				done()
			})
		})

		it('can set loading to true from the onSearch callback', (done) => {
			const vm = new Vue({
				template: '<div><v-select loading ref="select" :on-search="foo"></v-select></div>',
				methods: {
					foo(search, loading) {
						loading(true)
					}
				}
			}).$mount()

			let select = vm.$refs.select
			select.onSearch(select.search, select.toggleLoading)

			Vue.nextTick(() => {
				expect(vm.$refs.select.mutableLoading).toEqual(true)
				done()
			})
		})

		it('will sync mutable loading with the loading prop', (done) => {
      const vm = new Vue({
        template: '<div><v-select ref="select" :loading="loading"></v-select></div>',
				data: {loading:false}
      }).$mount()
			vm.loading = true
			Vue.nextTick(() => {
      	expect(vm.$refs.select.mutableLoading).toEqual(true)
				done()
			})
		})
	})

	describe('Reset on options change', () => {
		it('should not reset the selected value by default when the options property changes', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value"></v-select></div>',
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].mutableOptions = ['four', 'five', 'six']
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual('one')
				done()
			})
		})

		it('should reset the selected value when the options property changes', (done) => {
			const vm = new Vue({
				template: '<div><v-select :options="options" :value="value" reset-on-options-change></v-select></div>',
				components: {vSelect},
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()
			vm.$children[0].mutableOptions = ['four', 'five', 'six']
			Vue.nextTick(() => {
				expect(vm.$children[0].mutableValue).toEqual(null)
				done()
			})
		})
	})

	describe('Single value options', () => {
		it('should reset the search input on focus lost', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" :value="value"></v-select></div>',
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()

			vm.$children[0].open = true
			vm.$refs.select.search = "t"
			expect(vm.$refs.select.search).toEqual('t')

			vm.$children[0].onSearchBlur()
			Vue.nextTick(() => {
				expect(vm.$refs.select.search).toEqual('')
				done()
			})
    })

		it ('should not reset the search input on focus lost when clearSearchOnSelect is false', (done) => {
			const vm = new Vue({
				template: '<div><v-select ref="select" :options="options" :value="value" :clear-search-on-select="false"></v-select></div>',
				data: {
					value: 'one',
					options: ['one', 'two', 'three']
				}
			}).$mount()
			expect(vm.$refs.select.clearSearchOnSelect).toEqual(false)

			vm.$children[0].open = true
			vm.$refs.select.search = "t"
			expect(vm.$refs.select.search).toEqual('t')

			vm.$children[0].onSearchBlur()
			Vue.nextTick(() => {
				expect(vm.$refs.select.search).toEqual('t')
				done()
			})
		})
	})

	describe('Clear button', () => {

		it( 'should be displayed on single select when value is selected', () => {
			const VueSelect = Vue.extend( vSelect )
			const vm = new VueSelect({
				propsData: {
					options: ['foo','bar'],
					value: 'foo'
				}
			}).$mount()

			expect(vm.showClearButton).toEqual(true)
		})

		it( 'should not be displayed on multiple select', () => {
			const VueSelect = Vue.extend( vSelect )
			const vm = new VueSelect({
				propsData: {
					options: ['foo','bar'],
					value: 'foo',
					multiple: true
				}
			}).$mount()

			expect(vm.showClearButton).toEqual(false)
		})

		it( 'should remove selected value when clicked', () => {
			const VueSelect = Vue.extend( vSelect )
			const vm = new VueSelect({
				propsData: {
					options: ['foo','bar'],
					value: 'foo'
				}
			}).$mount()

			expect(vm.mutableValue).toEqual('foo')
			vm.$el.querySelector( 'button.clear' ).click()
			expect(vm.mutableValue).toEqual(null)
		})

		it( 'should be disabled when component is disabled', () => {
			const VueSelect = Vue.extend( vSelect )
			const vm = new VueSelect({
				propsData: {
					options: ['foo','bar'],
					value: 'foo',
					disabled: true
				}
			}).$mount()

			const buttonEl = vm.$el.querySelector( 'button.clear' )
			expect(buttonEl.disabled).toEqual(true);
		})

	});
})
