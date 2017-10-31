<style lang="scss">
    @import './assets/scss/docs.scss';

    #sidebar nav {
        // position: fixed;
        // top: 0;
    }
</style>

<template>
    <div id="docs" class="container-fluid">
        <div class="col-md-3" id="sidebar">
            <nav>
                <div class="form-group">
                    <label class="control-label">Version</label>
                    <v-select id="select-version" v-model="version" :searchable="false" :options="versions"></v-select>
                </div>
                <p v-if="version == 'v1.x'">
                    <small><code>v1.x</code> of <code>vue-select</code> should be used with <code>vue 1.x</code></small>
                </p>
                <sidebar></sidebar>
            </nav>
        </div>
        <div class="col-md-7">
            <markdown name="install"/>
            <v-select v-model="selection.install" :options="['foo','bar']"></v-select>

            <example md="single">
                <template>
                    <v-select v-model="selection.single" :options="countries"></v-select>
                </template>
            </example>

            <example md="multiple">
                <template>
                    <v-select v-model="selection.multiple" multiple :options="countries"></v-select>
                </template>
            </example>

            <example md="reactive">
                <div slot="afterMarkdown">
                <div class="radio">
                    <label>
                        <input type="radio" v-model="reactiveOptionSelection" value="0" />
                        <code lang="html">
                            &lt;v-select :options="countries"&gt;
                        </code>
                    </label>
                </div>
                <div class="radio">
                    <label>
                        <input type="radio" v-model="reactiveOptionSelection" value="1" />
                        <code lang="html">
                            &lt;v-select :options="['foo', 'bar', 'baz']"&gt;
                        </code>
                    </label>
                </div>
            </div>
                <template>
                    <v-select :options="reactiveOptions" v-model="selection.reactive"></v-select>
                </template>
            </example>

            <example md="sync">
                <template>
                    <v-select v-model="selection.sync" :options="simpleCountries"></v-select>
                    <button type="button" class="btn btn-default" @click="selection.sync = 'United States'">
                        Set to United States
                    </button>
                    <button type="button" class="btn btn-default" @click="selection.sync = 'Canada'">
                        Set to Canada
                    </button>
                </template>

                <template slot="afterMarkdown">
                    Current value: <code>{{ selection.sync }}</code>
                </template>
            </example>

            <example md="customLabels">
                <v-select label="value" :options="countries" v-model="selection.customLabels"></v-select>
            </example>

            <example md="onChange">
                <template slot="afterMarkdown">
                    <div class="radio">
                        <label>
                            <input type="radio" v-model="inputCallbackSelection" value="console" />
                            <code lang="html">
                                console.log(val)
                            </code>
                        </label>
                    </div>
                    <div class="radio">
                        <label>
                            <input type="radio" v-model="inputCallbackSelection" value="alert" />
                            <code lang="html">
                                alert(val)
                            </code>
                        </label>
                    </div>
                </template>
                <v-select @input="changeCallback" :options="countries"></v-select>
            </example>

            <example md="ajax">
                <v-select
                :debounce="250"
                :on-search="getAjaxOptions"
                :options="ajaxOptions"
                placeholder="Search GitHub Repositories"
                label="full_name">

                </v-select>
            </example>

            <markdown name="parameters"/>
            <!-- <article v-html="vModel"></article>
            <article v-html="single"></article>
            <article v-html="reactive"></article>
            <article v-html="labels"></article>
            <article v-html="ajax"></article> -->
        </div>
    </div>
</template>

<script type="text/babel">

  /**
   * Note that this file (and anything other than src/components/Select.vue)
   * has nothing to do with how you use vue-select. These files are used
   * for the demo site at http://sagalbot.github.io/vue-select/.
   */

  // import Examples from './components/Examples.vue'
  // import Params from './components/Params.vue'
  // import Ajax from './components/snippets/Ajax.vue'
  import versionInfo from './data/versions'
  import Example from './components/Example.vue'
  import Markdown from './components/Markdown.vue'

  export default {
    // components: { Params, Examples, Ajax }
    components: {
      Markdown,
      Example
    },
    data () {
      return {
        versionInfo: versionInfo,
        versions: versionInfo.versions,
        selection: {
          install: null,
          single: null,
          multiple: null,
          reactive: null,
          sync: 'Canada',
          customLabels: null,
          onChange: null,
        },
        countries: require('./data/advanced'),
        simpleCountries: require('./data/simple'),
        reactiveOptionSelection: '0',
        inputCallbackSelection: 'console',
        ajaxOptions: [],
      }
    },

    computed: {
      version: {
        get () {
          return versionInfo.version
        },

        set (version) {
          versionInfo.version = version
        },
      },

      changeCallback() {
        const methodName = this.inputCallbackSelection+'Callback'
        return this[methodName]
      },

      reactiveOptions() {
        if (this.reactiveOptionSelection == '0') {
          return this.countries
        }
        return ['foo', 'bar', 'baz']
      },
    },

    methods: {
      consoleCallback(val) {
        console.dir(JSON.stringify(val))
      },

      alertCallback(val) {
        alert(JSON.stringify(val))
      },

      getAjaxOptions(search, loading) {
        loading(true)
        console.log(search)
        this.$http.get('https://api.github.com/search/repositories', {
          params: {
            q: search,
          }
        }).then(resp => {
          this.ajaxOptions = resp.data.items
          loading(false)
        })
      }
    }
  }
</script>
