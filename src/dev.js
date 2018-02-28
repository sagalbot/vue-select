import Vue from 'vue'
import vSelect from './components/Select.vue'
import countries from 'docs/data/advanced.js'
import debounce from 'lodash/debounce'
import resource from 'vue-resource'

Vue.use(resource)

Vue.component('v-select', vSelect)

Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    placeholder: "placeholder",
    value: null,
    options: countries,
    ajaxRes: [],
    people: []
  },
  methods: {
    search(search, loading) {
      loading(true)
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
        vm.ajaxRes = res.data.items
        loading(false)
      })
    }, 250)
  }
})
