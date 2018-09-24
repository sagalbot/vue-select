import Vue from 'vue'
import Fuse from 'fuse.js'
import debounce from 'lodash/debounce'
import resource from 'vue-resource'
import vSelect from '../src/components/Select.vue'
import countries from './data/countryCodes'
import fuseSearchOptions from './data/books'

Vue.use(resource)
Vue.component('v-select', vSelect)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    placeholder: "placeholder",
    value: null,
    options: countries,
    optgroups: [
      'Text Not in Group', 
      {
        label: 'Text in group',
        value: 'text-in-group'
      },
      {
        title: 'Opt Group With Text Elements',
        options: ['Item A', 'Item B', 'Item C']
      },
      {
      title: 'Opt Group with Objects',
      options: countries
    }],
    ajaxRes: [],
    people: [],
    fuseSearchOptions
  },
  methods: {
    search(search, loading) {
      loading(true);
      this.getRepositories(search, loading, this)
    },
    searchPeople(search, loading) {
      loading(true)
      this.getPeople(loading, this)
    },
    getPeople: debounce((loading, vm) => {
      vm.$http.get(`https://reqres.in/api/users?per_page=10`).then(res => {
        vm.people = res.data.data
        loading(false)
      })
    }, 250),
    getRepositories: debounce((search, loading, vm) => {
      vm.$http.get(`https://api.github.com/search/repositories?q=${search}`).then(res => {
        vm.ajaxRes = res.data.items;
        loading(false)
      })
    }, 250),
    fuseSearch(options, search) {
      return new Fuse(options, {
        keys: ['title', 'author.firstName', 'author.lastName'],
      }).search(search);
    }
  }
});