import Vue from 'vue'
import vSelect from './components/Select.vue'
import countries from 'docs/data/advanced.js'
import debounce from 'lodash/debounce'
import resource from 'vue-resource'

Vue.use(resource)

Vue.component('v-select', vSelect)

Vue.config.devtools = true

function filter(item, key) {
  var b = [];
  var j = 0;
  for (var i = 0; i < item.length; i++) {
    if (j < key.length && item[i] == key[j]) {
      j++;
      b.push(i);
    }
  }
  return j == key.length;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    placeholder: "placeholder",
    value: null,
    options: countries,
    ajaxRes: [],
    mySearch(option, search) {
      return filter(option.label.toLowerCase(), search);
    },
  },
  methods: {
    search(search, loading) {
      loading(true)
      this.getRepositories(search, loading, this)
    },
    getRepositories: debounce((search, loading, vm) => {
      vm.$http.get(`https://api.github.com/search/repositories?q=${search}`).then(res => {
        vm.ajaxRes = res.data.items
        loading(false)
      })
    }, 250)
  }
})
