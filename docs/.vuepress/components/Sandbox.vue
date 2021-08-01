<template>
  <div id="sandbox-wrap">
    <div id="config">
      <div v-if="!hideHelp" class="list-item">
        <p>
          Use the controls below to adjust the props used by the vue-select
          components.
        </p>
        <p>
          The API provides more props than are shown here, these are some
          commonly adjusted settings.
        </p>
      </div>

      <h5 class="list-item">Basic Features</h5>

      <div class="list-item">
        <label for="multiple">
          <input
            id="multiple"
            v-model="configuration.multiple"
            type="checkbox"
          />
          <code
            >:multiple="{{ configuration.multiple ? 'true' : 'false' }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="disabled">
          <input
            id="disabled"
            v-model="configuration.disabled"
            type="checkbox"
          />
          <code
            >:disabled="{{ configuration.disabled ? 'true' : 'false' }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="clearable">
          <input
            id="clearable"
            v-model="configuration.clearable"
            type="checkbox"
          />
          <code
            >:clearable="{{ configuration.clearable ? 'true' : 'false' }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="searchable">
          <input
            id="searchable"
            v-model="configuration.searchable"
            type="checkbox"
          />
          <code
            >:searchable="{{
              configuration.searchable ? 'true' : 'false'
            }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="filterable">
          <input
            id="filterable"
            v-model="configuration.filterable"
            type="checkbox"
          />
          <code
            >:filterable="{{
              configuration.searchable ? 'true' : 'false'
            }}"</code
          >
        </label>
      </div>

      <h5 class="list-item">Tagging</h5>

      <div class="list-item">
        <label for="taggable">
          <input
            id="taggable"
            v-model="configuration.taggable"
            type="checkbox"
          />
          <code
            >:taggable="{{ configuration.taggable ? 'true' : 'false' }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="noDrop">
          <input id="noDrop" v-model="configuration.noDrop" type="checkbox" />
          <code>:no-drop="{{ configuration.noDrop ? 'true' : 'false' }}"</code>
        </label>
      </div>

      <div class="list-item">
        <label for="pushTags">
          <input
            id="pushTags"
            v-model="configuration.pushTags"
            type="checkbox"
          />
          <code
            >:push-tags="{{ configuration.pushTags ? 'true' : 'false' }}"</code
          >
        </label>
      </div>

      <h5 class="list-item">UX</h5>

      <div class="list-item">
        <label for="selectOnTab">
          <input
            id="selectOnTab"
            v-model="configuration.selectOnTab"
            type="checkbox"
          />
          <code
            >:select-on-tab="{{
              configuration.selectOnTab ? 'true' : 'false'
            }}"</code
          >
        </label>
      </div>

      <div class="list-item">
        <label for="closeOnSelect">
          <input
            id="closeOnSelect"
            v-model="configuration.closeOnSelect"
            type="checkbox"
          />
          <code
            >:close-on-select="{{
              configuration.closeOnSelect ? 'true' : 'false'
            }}"</code
          >
        </label>
      </div>

      <h5 class="list-item">Localization / i18n</h5>

      <div class="list-item">
        <label for="rtl">
          <input
            id="rtl"
            v-model="configuration.dir"
            type="radio"
            value="rtl"
          />
          <code>dir="rtl"</code>
        </label>
        <label for="ltr">
          <input
            id="ltr"
            v-model="configuration.dir"
            type="radio"
            value="ltr"
          />
          <code>dir="ltr"</code>
        </label>
      </div>
    </div>

    <div id="sandbox">
      <slot v-bind="configuration">
        <div class="example">
          <v-select
            v-bind="configuration"
            placeholder="country objects"
          ></v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            placeholder="country objects, using option scoped slots"
          >
            <template slot="selected-option" slot-scope="{ label, value }">
              {{ label }} -- {{ value }}
            </template>
            <template slot="option" slot-scope="{ label, value }">
              {{ label }} ({{ value }})
            </template>
          </v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            :options="['cat', 'dog', 'bear']"
            placeholder="string options, option slots"
          >
            <template slot="selected-option" slot-scope="{ label }">
              {{ label }}
            </template>
            <template slot="option" slot-scope="{ label }">
              {{ label }}
            </template>
          </v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            :options="[1, 5, 10]"
            placeholder="options=[1,5,10]"
          ></v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            label="title"
            :options="optionDataSets.books"
            :filter="fuseSearch"
            placeholder="advanced filtering w/ fuse.js + scoped slots"
          >
            <template slot="option" slot-scope="option">
              <strong>{{ option.title }}</strong
              ><br />
              <em>{{
                `${option.author.firstName} ${option.author.lastName}`
              }}</em>
            </template>
          </v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            placeholder="search github repositories.."
            label="full_name"
            :options="ajaxRes"
            @search="search"
          >
          </v-select>
        </div>

        <div class="example">
          <v-select
            v-bind="configuration"
            :options="[]"
            placeholder="options=[]"
          ></v-select>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import debounce from 'lodash/debounce'
import vSelect from '../../../src/components/Select.vue'
import countries from '../data/countryCodes'
import books from '../data/books'

const defaultConfig = () => ({
  options: countries,
  multiple: false,
  dir: 'ltr',
  clearable: true,
  searchable: true,
  filterable: true,
  noDrop: false,
  closeOnSelect: true,
  disabled: false,
  selectOntab: false,
  placeholder: 'Select a Country...',
})

export default {
  components: { vSelect },
  props: {
    hideHelp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      configuration: defaultConfig(),
      value: null,
      ajaxRes: [],
      people: [],
      optionDataSet: 'countries',
      optionDataSets: {
        countries,
        books,
      },
    }
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
      vm.$http.get(`https://reqres.in/api/users?per_page=10`).then((res) => {
        vm.people = res.data.data
        loading(false)
      })
    }, 250),
    getRepositories: debounce((search, loading, vm) => {
      vm.$http
        .get(`https://api.github.com/search/repositories?q=${search}`)
        .then((res) => {
          vm.ajaxRes = res.data.items
          loading(false)
        })
    }, 250),
  },
}
</script>

<style scoped>
#sandbox-wrap {
  min-height: 100%;
  display: grid;
  grid-template-columns: auto 75%;
  grid-template-rows: auto;
  grid-template-areas: 'sidebar component';
}

#config {
  grid-area: sidebar;
  border-right: 1px solid #eaecef;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#sandbox {
  grid-area: component;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list-item {
  margin-top: 0;
  margin-bottom: 1rem;
  padding: 1rem 1rem 0;
}

.list-item:not(:first-child) {
  border-top: 1px solid #eaecef;
}

.example {
  margin-bottom: 2rem;
}

.v-select {
  width: 25em;
}
</style>
