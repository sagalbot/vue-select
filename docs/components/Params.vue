<template>
<div>
    <h2 class="page-header">Parameters</h2>
    <pre v-pre><code class="language-javascript">props: {

   /**
     * Contains the currently selected value. Very similar to a
     * `value` attribute on an <input>. You can listen for changes
     * using 'change' event using v-on
     * @type {Object||String||null}
     */
   value: {
      default: null
    },

    /**
     * An array of strings or objects to be used as dropdown choices.
     * If you are using an array of objects, vue-select will look for
     * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
     * custom label key can be set with the `label` prop.
     * @type {Array}
     */
    options: {
      type: Array,
      default() { return [] },
    },

    /**
     * Enable/disable filtering the options.
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: true
    },

    /**
     * Enable/disable drag-drop sortability of selected options.
     * @type {Boolean}
     */
    sortable: {
      type: Boolean,
      default: false
    },

    /**
     * Equivalent to the `multiple` attribute on a `&lt;select&gt;` input.
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * Equivalent to the `placeholder` attribute on an `&lt;input&gt;`.
     * @type {String}
     */
    placeholder: {
      type: String,
      default: ''
    },

    /**
     * Sets a Vue transition property on the `.dropdown-menu`. vue-select
     * does not include CSS for transitions, you'll need to add them yourself.
     * @type {String}
     */
    transition: {
      type: String,
      default: 'expand'
    },

    /**
     * Enables/disables clearing the search text when an option is selected.
     * @type {Boolean}
     */
    clearSearchOnSelect: {
      type: Boolean,
      default: true
    },

    /**
     * Close a dropdown when an option is chosen. Set to false to keep the dropdown
     * open (useful when combined with multi-select, for example)
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },

    /**
     * Tells vue-select what key to use when generating option labels when
     * `option` is an object.
     * @type {String}
     */
    label: {
      type: String,
      default: 'label'
    },

    /**
     * An optional callback function that is called each time the selected
     * value(s) change. When integrating with Vuex, use this callback to trigger
     * an action, rather than using :value.sync to retreive the selected value.
     * @type {Function}
     * @default {null}
     */
     onChange: {
       type: Function,
       default: function (val) {
         this.$emit('input', val)
       }
     },

    /**
     * Sets the id of the input element.
     * @type {String}
     * @default {null}
     */
    inputId: {
      type: String
    }

  }
    </code></pre>
</div>
</template>

<script>
  /**
   * Note that this file (and anything other than src/components/Select.vue)
   * has nothing to do with how you use vue-select. These files are used
   * for the demo site at http://sagalbot.github.io/vue-select/. They'll
   * be moved out of this repo in the very near future to avoid confusion.
   */
  export default {}
</script>
