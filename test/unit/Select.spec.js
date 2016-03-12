/* global describe, it, expect */

import Vue from 'vue'
import vSelect from '../../src/components/Select.vue'

describe('Select.vue', () => {

  // it('sets open to true when search on focus and false on blur', () => {
  //   const vm = new Vue({
  //     template: '<div><v-select :value.sync="value"></v-select></div>',
  //     components: { vSelect },
  //     data: {
  //       value: ['one'],
  //       options: ['one','two','three']
  //     }
  //   }).$mount()
  //
  //   vm.$children[0].$els.search.focus()
  //   expect(vm.$children[0].$get('open')).toEqual(true)
  // })

  it('can accept an array with pre-selected values', () => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()

    expect(vm.$children[0].value).toEqual(['one'])
  })

  it('can accept an array of objects and pre-selected value (single)', () => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: {label: 'This is Foo', value: 'foo'},
        options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
      }
    }).$mount()

    expect( vm.$children[0].$get('value').value ).toEqual( 'foo' )
    expect( vm.$children[0].$get('value').label ).toEqual( 'This is Foo' )
  })

  it('can accept an array of objects and pre-selected values (multiple)', () => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}],
        options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
      }
    }).$mount()

    var values = vm.$children[0].$get('value')
    var labels = []

    labels = values.map( value => value.label )
    values = values.map( value => value.value )

    expect( values ).toEqual( ['foo', 'bar'] )
    expect( labels ).toEqual( ['This is Foo', 'This is Bar'] )
  })

  it('removes the last item in the value array on delete keypress when multiple is true', () => {

    const vm = new Vue({
      template: '<div><v-select :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one','two'],
        options: ['one','two','three']
      }
    }).$mount()

    vm.$children[0].maybeDeleteValue()
    Vue.nextTick(() => {
      expect(vm.$children[0].$get('value')).toEqual(['one'])
    })
  })

  it('sets the value to null on delete keypress when multiple is false', () => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: 'one',
        options: ['one','two','three']
      }
    }).$mount()

    vm.$children[0].maybeDeleteValue()
    Vue.nextTick(() => {
      expect(vm.$children[0].$get('value')).toEqual(null)
    })
  })

  it('can determine if the value prop is empty', () => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: [],
        options: ['one','two','three']
      }
    }).$mount()

    var select = vm.$children[0]
    expect(select.isValueEmpty).toEqual(true)
    select.$set('value', ['one'])
    expect(select.isValueEmpty).toEqual(false)
    select.$set('value', 'one')
    select.$set('multiple', false)
    expect(select.isValueEmpty).toEqual(false)
    select.$set('value', '')
    expect(select.isValueEmpty).toEqual(true)
    select.$set('value', null)
    expect(select.isValueEmpty).toEqual(true)
  })

  it('resets the selected values when the options property changes', (done) => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()

    vm.$children[0].options = ['four','five','six']
    Vue.nextTick(() => {
      expect(vm.$children[0].$get('value')).toEqual([])
      done()
    })
  })

  it('can retain values present in a new array of options (multiple)', (done) => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()

    vm.$children[0].$set('options', ['one','five','six'])
    Vue.nextTick(function() {
      expect(vm.$children[0].value).toEqual(['one'])
      done()
    })
  })

  it('can retain values present in a new array of options (single)', (done) => {
    const vm = new Vue({
      template: '<div><v-select :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: 'one',
        options: ['one','two','three']
      }
    }).$mount()

    vm.$children[0].$set('options', ['one','five','six'])
    Vue.nextTick(function() {
      expect(vm.$children[0].value).toEqual('one')
      done()
    })
  })
})


// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
