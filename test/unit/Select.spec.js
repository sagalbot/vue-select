/* global describe, it, expect */

import Vue from 'vue'
import vSelect from '../../src/components/Select.vue'

function trigger (target, event, process) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

describe('Select.vue', () => {

  it('can accept an array with pre-selected values', () => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
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
      template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
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
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
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

  it('removes the given tag when its close icon is clicked', (done) => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()
    vm.$children[0].$els.toggle.querySelector('.close').click()
    Vue.nextTick(() => {
      expect(vm.$children[0].$get('value')).toEqual([])
      done()
    })
  })

  it('removes the last item in the value array on delete keypress when multiple is true', () => {

    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
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
      template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
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
      template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
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

    select.$set('value', [{l:'f'}])
    expect(select.isValueEmpty).toEqual(false)

    select.$set('value', 'one')
    expect(select.isValueEmpty).toEqual(false)

    select.$set('value', {label: 'foo', value: 'foo'})
    expect(select.isValueEmpty).toEqual(false)

    select.$set('value', '')
    expect(select.isValueEmpty).toEqual(true)

    select.$set('value', null)
    expect(select.isValueEmpty).toEqual(true)
  })

  it('resets the selected values when the options property changes', (done) => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
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

  it('can retain values present in a new array of options', () => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()
    vm.$children[0].$set('options', ['one','five','six'])
    expect(vm.$children[0].value).toEqual(['one'])
  })

  it('can generate labels using the default label key', () => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: [{label: 'Baz'}],
        options: [{label: 'Foo'}, {label: 'Baz'}]
      }
    }).$mount()
    expect(vm.$children[0].$els.toggle.querySelector('.selected-tag').textContent).toContain('Baz')
  })

  it('can generate labels using a custom label key', () => {
    const vm = new Vue({
      template: '<div><v-select label="name" :options="options" :value.sync="value" :multiple="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: [{name: 'Baz'}],
        options: [{name: 'Foo'}, {name: 'Baz'}]
      }
    }).$mount()
    expect(vm.$children[0].$els.toggle.querySelector('.selected-tag').textContent).toContain('Baz')
  })

  it('can run a callback when the selection changes', (done) => {
    const vm = new Vue({
      template: '<div><v-select :on-change="foo" value="bar" :options="options"></v-select></div>',
      components: { vSelect },
      data: {
        val: null,
        options: ['foo','bar','baz']
      },
      methods: {
        foo(value) {
          this.val = value
        }
      }
    }).$mount()

    vm.$children[0].select('foo')
    Vue.nextTick(function() {
      expect(vm.$get('val')).toEqual('foo')

      vm.$children[0].$set('value', 'baz')
      Vue.nextTick(function() {
        expect(vm.$get('val')).toEqual('baz')
        done()
      })
    })
  })

  it('can adding option if taggable enabled and search is not empty', () => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true" :taggable="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()
    vm.$children[0].search = 'four'

    trigger(vm.$children[0].$els.search, 'keyup', function (e) {
      e.keyCode = 13
    })

    expect(vm.$children[0].options[0]).toEqual('four')
  })

  it('should select added option if taggable enabled and search is not empty', (done) => {
    const vm = new Vue({
      template: '<div><v-select :options="options" :value.sync="value" :multiple="true" :taggable="true"></v-select></div>',
      components: { vSelect },
      data: {
        value: ['one'],
        options: ['one','two','three']
      }
    }).$mount()
    vm.$children[0].search = 'four'

    trigger(vm.$children[0].$els.search, 'keyup', function (e) {
      e.keyCode = 13
    })
    Vue.nextTick(() => {
      expect(vm.$children[0].$get('value')).toEqual(['one', 'four'])
      done()
    })
  })
})

// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
