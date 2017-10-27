<template>
<section>
  <h2 class="page-header" id="install">Install &amp; and Usage</h2>
  <div class="row row-col-vh">
    <div class="col-md-7">
      <install-snippet></install-snippet>
    </div>

    <div class="col-md-5">
        <p>The resulting vue-select, and it's value: <v-code lang="json">{{ install }}</v-code></p>
        <v-select v-model="install" :options="['foo','bar','baz']"></v-select>
    </div>
  </div>

  <h2 class="page-header" id="examples">Examples</h2>

  <article class="doc-row" id="ex-multiple">
    <h3 class="page-header">Single/Multiple Selection</h3>
    <div class="row">
      <div class="col-md-6">
        <h4>Single Option Select</h4>
        <pre><v-code lang="markup">&#x3C;v-select :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code></pre>
        <v-select :options="countries"></v-select>
      </div>

      <div class="col-md-6">
        <h4>Multiple Option Select</h4>
        <pre><v-code lang="markup">&#x3C;v-select multiple :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code></pre>
        <v-select multiple :options="countries"></v-select>
      </div>
    </div>
  </article>

  <article class="doc-row" id="ex-reactive">
    <h3 class="page-header">Reactive Options</h3>
    <div class="row">
      <div class="col-md-6">
          <p>When the list of options provided by the parent changes, vue-select will react as you'd expect.</p>
          <div style="margin-top:0;" class="radio">
          <label>
            <input type="radio" name="reactive-options" v-model="reactive" :value="countries">
            <v-code lang="markup">&#x3C;v-select :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code>
          </label>
        </div>

        <div class="radio">
          <label>
            <input type="radio" name="reactive-options" v-model="reactive" :value="['foo','bar','baz']">
            <v-code lang="markup">&#x3C;v-select :options=&#x22;['foo','bar','baz']&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code>
          </label>
        </div>
      </div>

      <div class="col-md-6">
        <v-select :options="reactive"></v-select>
      </div>
    </div>
  </article>

  <article class="doc-row" id="ex-syncing">
    <h3 class="page-header">Two-Way Value Syncing</h3>
    <div class="row">
    <div class="col-md-6">
      <p>The most common use case for vue-select is being able to sync the components value with a parent component. The <code>value</code> property supports two-way data binding to accomplish this.</p>
      <p>The <code>.sync</code> data-binding modifier is completely optional. You may use <code>value</code> without a two-way binding to preselect options.</p>
      <p>Here we have preselected 'Canada' by setting <code>syncedVal: 'Canada'</code> on the parent component. The buttons below demonstrate how you can set the <code>value</code> from the parent.</p>

      <p>Current value: <v-code>{{ syncedVal }}</v-code></p>
    </div>

    <div class="col-md-6">
      <div class="form-group">
        <pre><v-code lang="markup">&#x3C;v-select :value.sync=&#x22;syncedVal&#x22; :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code></pre>
      </div>
      <div class="form-group">
      <v-select :options="simple" v-model="syncedVal"></v-select>
      </div>

      <div class="form-group">
      <button @click="syncedVal = 'United States'" class="btn btn-default">Set to United States</button>
      <button @click="syncedVal = 'Canada'" class="btn btn-default">Set to Canada</button>
      </div>
    </div>
  </div>
  </article>

  <article class="doc-row" id="ex-labels">
    <h3 class="page-header">Custom Labels</h3>
    <div class="row">
    <div class="col-md-6">
      <p>By default when the <code>options</code> array contains objects, <code>vue-select</code> looks for the <code>label</code> key for display. If your data source doesn't contain that key, you can set your own using the <code>label</code> prop.</p>
      <p>On this page, the list of countries used in the examples contains <code>value</code> and <code>label</code> properties: <v-code lang="json">{value: "CA", label: "Canada"}</v-code>. In this example, we'll display the country code instead of the label.</p>
    </div>

    <div class="col-md-6">
      <pre><v-code lang="markup">&#x3C;v-select label=&#x22;value&#x22; :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code></pre>
      <v-select :options="countries" label="value"></v-select>
    </div>
  </div>
  </article>

  <article class="doc-row" id="ex-vuex">
    <h3 class="page-header">Change Event <small>Vuex Compatibility</small></h3>
    <div class="row">
    <div class="col-md-6">
      <p>vue-select provides an <code>change</code> event. This function is passed the currently selected value(s) as it's only parameter.</p>
      <p>This is very useful when integrating with Vuex, as it will allow your to trigger an action to update your vuex state object. Choose a callback and see it in action.</p>

      <div class="form-inline">
        <div class="radio">
          <label>
            <input type="radio" v-model="callback" value="console"> <code>console.log(val)</code>
          </label>
        </div>

        <div class="radio">
          <label>
            <input type="radio" v-model="callback" value="alert"> <code>alert(val)</code>
          </label>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <pre><v-code lang="markup">&#x3C;v-select :on-change=&#x22;consoleCallback&#x22; :options=&#x22;countries&#x22;&#x3E;&#x3C;/v-select&#x3E;</v-code></pre>
      <pre><v-code lang="javascript">methods: {
  consoleCallback(val) {
    console.dir(JSON.stringify(val))
  },

  alertCallback(val) {
    alert(JSON.stringify(val))
  }
}</v-code></pre>
      <v-select :options="countries" :on-change="getCallback"></v-select>
    </div>
  </div>
  </article>

  <!-- <ajax></ajax> -->
</section>
</template>

<script>
  /**
   * Note that this file (and anything other than src/components/Select.vue)
   * has nothing to do with how you use vue-select. These files are used
   * for the demo site at http://sagalbot.github.io/vue-select/. They'll
   * be moved out of this repo in the very near future to avoid confusion.
   */
  import countries from '../data/advanced'
  import simple from '../data/simple'
  import vSelect from 'src/components/Select.vue'
  import vCode from './Code.vue'
  import Ajax from './snippets/Ajax.vue'
  import InstallSnippet from './snippets/InstallSnippet.vue'

  export default {
    components: {vSelect,vCode,InstallSnippet,Ajax},
    // components: {vSelect,vCode,InstallSnippet},
    data () {
      return {
        countries,
        simple,
        callback: 'console',
        reactive: null,
        install: null,
        syncedVal: 'Canada'
      }
    },

    methods: {
      consoleCallback(val) {
        console.dir(JSON.stringify(val))
      },

      alertCallback(val) {
        alert(JSON.stringify(val))
      }
    },

    computed: {
      getCallback() {
        if( this.callback === 'alert' ) {
          return this.alertCallback
        }

        return this.consoleCallback
      }
    }
  }
</script>
