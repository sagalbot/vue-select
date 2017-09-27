<style>
  .v-select {
    position: relative;
    font-family: sans-serif;
  }
  .v-select,
  .v-select * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  /* Open Indicator */
  .v-select .open-indicator {
    position: absolute;
    bottom: 6px;
    right: 10px;
    display: inline-block;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    opacity: 1;
    transition: opacity .1s;
    height: 20px; width: 10px;
  }
  .v-select .open-indicator:before {
    border-color: rgba(60, 60, 60, .5);
    border-style: solid;
    border-width: 3px 3px 0 0;
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    vertical-align: top;
    transform: rotate(133deg);
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    box-sizing: inherit;
  }
  /* Open Indicator States */
  .v-select.open .open-indicator:before {
    transform: rotate(315deg);
  }
  .v-select.loading .open-indicator {
    opacity: 0;
  }
  .v-select.open .open-indicator {
    bottom: 1px;
  }
  /* Dropdown Toggle */
  .v-select .dropdown-toggle {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: block;
    padding: 0;
    background: none;
    border: 1px solid rgba(60, 60, 60, .26);
    border-radius: 4px;
    white-space: normal;
    transition: border-radius .25s;
  }
  .v-select .dropdown-toggle:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
  /* Dropdown Toggle States */
  .v-select.searchable .dropdown-toggle {
    cursor: text;
  }
  .v-select.unsearchable .dropdown-toggle {
    cursor: pointer;
  }
  .v-select.open .dropdown-toggle {
    border-bottom-color: transparent;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  /* Dropdown Menu */
  .v-select .dropdown-menu {
    display:block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 160px;
    padding: 5px 0;
    margin: 0;
    width: 100%;
    overflow-y: scroll;
    border: 1px solid rgba(0, 0, 0, .26);
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,.15);
    border-top: none;
    border-radius: 0 0 4px 4px;
    text-align: left;
    list-style: none;
    background: #fff;
  }
  .v-select .no-options {
    text-align: center;
  }
  /* Selected Tags */
  .v-select .selected-tag {
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 26px;
    margin: 4px 1px 0px 3px;
    padding: 1px 0.25em;
    float: left;
    line-height: 24px;
  }
  .v-select.single .selected-tag {
    background-color: transparent;
    border-color: transparent;
  }
  .v-select.single.open .selected-tag {
    position: absolute;
    opacity: .5;
  }
  .v-select.single.open.searching .selected-tag,
  .v-select.single.loading .selected-tag {
    display: none;
  }
  .v-select .selected-tag .close {
    float: none;
    margin-right: 0;
    font-size: 20px;
    appearance: none;
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    filter: alpha(opacity=20);
    opacity: .2;
  }
  .v-select.single.searching:not(.open):not(.loading) input[type="search"] {
    opacity: .2;
  }
  /* Search Input */
  .v-select input[type="search"]::-webkit-search-decoration,
  .v-select input[type="search"]::-webkit-search-cancel-button,
  .v-select input[type="search"]::-webkit-search-results-button,
  .v-select input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
  .v-select input[type="search"]::-ms-clear {
    display: none;
  }
  .v-select input[type="search"],
  .v-select input[type="search"]:focus {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    line-height: 1.42857143;
    font-size:1em;
    height: 34px;
    display: inline-block;
    border: none;
    outline: none;
    margin: 0;
    padding: 0 .5em;
    width: 10em;
    max-width: 100%;
    background: none;
    position: relative;
    box-shadow: none;
    float: left;
    clear: none;
  }
  /* Search Input States */
  .v-select.unsearchable input[type="search"] {
    max-width: 1px;
  }
  /* List Items */
  .v-select li {
    line-height: 1.42857143; /* Normalize line height */
  }
  .v-select li > a {
    display: block;
    padding: 3px 20px;
    clear: both;
    color: #333; /* Overrides most CSS frameworks */
    white-space: nowrap;
  }
  .v-select li:hover {
    cursor: pointer;
  }
  .v-select .dropdown-menu .active > a {
    color: #333;
    background: rgba(50, 50, 50, .1);
  }
  .v-select .dropdown-menu > .highlight > a {
    /*
     * required to override bootstrap 3's
     * .dropdown-menu > li > a:hover {} styles
     */
    background: #5897fb;
    color: #fff;
  }
  .v-select .highlight:not(:last-child) {
    margin-bottom: 0; /* Fixes Bulma Margin */
  }
  /* Loading Spinner */
  .v-select .spinner {
    opacity: 0;
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 5px;
    text-indent: -9999em;
    overflow: hidden;
    border-top: .9em solid rgba(100, 100, 100, .1);
    border-right: .9em solid rgba(100, 100, 100, .1);
    border-bottom: .9em solid rgba(100, 100, 100, .1);
    border-left: .9em solid rgba(60, 60, 60, .45);
    transform: translateZ(0);
    animation: vSelectSpinner 1.1s infinite linear;
    transition: opacity .1s;
  }
  .v-select .spinner,
  .v-select .spinner:after {
    border-radius: 50%;
    width: 5em;
    height: 5em;
  }
  /* Loading Spinner States */
  .v-select.loading .spinner {
    opacity: 1;
  }
  /* KeyFrames */
  @-webkit-keyframes vSelectSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes vSelectSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  /* Dropdown Default Transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .15s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>

<template>
  <div class="dropdown v-select" :class="dropdownClasses">
    <div ref="toggle" @mousedown.prevent="toggleDropdown" class="dropdown-toggle">

      <span class="selected-tag" v-for="option in valueAsArray" v-bind:key="option.index">
        {{ getOptionLabel(option) }}
        <button v-if="multiple" @click="deselect(option)" type="button" class="close" aria-label="Remove option">
          <span aria-hidden="true">&times;</span>
        </button>
      </span>

      <input
              ref="search"
              v-model="search"
              @keydown.delete="maybeDeleteValue"
              @keyup.esc="onEscape"
              @keydown.up.prevent="typeAheadUp"
              @keydown.down.prevent="typeAheadDown"
              @keyup.enter.prevent="typeAheadSelect"
              @blur="onSearchBlur"
              @focus="onSearchFocus"
              type="search"
              class="form-control"
              :placeholder="searchPlaceholder"
              :readonly="!searchable"
              :style="{ width: isValueEmpty ? '100%' : 'auto' }"
              :id="inputId"
              aria-label="Search for option"
      >

      <i v-if="!noDrop" ref="openIndicator" role="presentation" class="open-indicator"></i>

      <slot name="spinner">
        <div class="spinner" v-show="mutableLoading">Loading...</div>
      </slot>
    </div>

    <transition :name="transition">
      <ul ref="dropdownMenu" v-if="dropdownOpen" class="dropdown-menu" :style="{ 'max-height': maxHeight }">
        <li v-for="(option, index) in filteredOptions" v-bind:key="index" :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }" @mouseover="typeAheadPointer = index">
          <a @mousedown.prevent="select(option)">
            <template v-if="checkboxed === true">
              <input type="checkbox" :name="option" :value="option" :checked="isOptionSelected(option)"> {{ getOptionLabel(option) }} </input>
            </template>
            <template v-else>
              {{ getOptionLabel(option) }}
            </template>
          </a>
        </li>
        <li v-if="!filteredOptions.length" class="no-options">
          <slot name="no-options">Sorry, no matching options.</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script type="text/babel">
  import pointerScroll from '../mixins/pointerScroll'
  import typeAheadPointer from '../mixins/typeAheadPointer'
  import ajax from '../mixins/ajax'

  export default {
    mixins: [pointerScroll, typeAheadPointer, ajax],

    props: {
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
       * @type {Object}
       */
      options: {
        type: Array,
        default() {
          return []
        },
      },

      /**
       * Sets the max-height property on the dropdown list.
       * @deprecated
       * @type {String}
       */
      maxHeight: {
        type: String,
        default: '400px'
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
       * Equivalent to the `multiple` attribute on a `<select>` input.
       * @type {Object}
       */
      multiple: {
        type: Boolean,
        default: false
      },

      /**
       * Equivalent to the `placeholder` attribute on an `<input>`.
       * @type {Object}
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
        default: 'fade'
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
       * Tells vue-select what key to use when generating option
       * labels when each `option` is an object.
       * @type {String}
       */
      label: {
        type: String,
        default: 'label'
      },

      /**
       * Callback to generate the label text. If {option}
       * is an object, returns option[this.label] by default.
       * @param  {Object || String} option
       * @return {String}
       */
      getOptionLabel: {
        type: Function,
        default(option) {
          if (typeof option === 'object') {
            if (this.label && option[this.label]) {
              return option[this.label]
            }
          }
          return option;
        }
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
       * Enable/disable creating options from searchInput.
       * @type {Boolean}
       */
      taggable: {
        type: Boolean,
        default: false
      },

      /**
       * When true, newly created tags will be added to
       * the options list.
       * @type {Boolean}
       */
      pushTags: {
        type: Boolean,
        default: false
      },

      /**
       * User defined function for adding Options
       * @type {Function}
       */
      createOption: {
        type: Function,
        default(newOption) {
          if (typeof this.mutableOptions[0] === 'object') {
            newOption = {[this.label]: newOption}
          }
          this.$emit('option:created', newOption)
          return newOption
        }
      },

      /**
       * When false, updating the options will not reset the select value
       * @type {Boolean}
       */
      resetOnOptionsChange: {
        type: Boolean,
        default: false
      },

      /**
       * Disable the dropdown entirely.
       * @type {Boolean}
       */
      noDrop: {
        type: Boolean,
        default: false
      },

      /**
       * Sets the id of the input element.
       * @type {String}
       * @default {null}
       */
      inputId: {
        type: String
      },
      checkboxed: {
        type:Boolean,
        default:false
      }
    },

    data() {
      return {
        search: '',
        open: false,
        mutableValue: null,
        mutableOptions: []
      }
    },

    watch: {
      /**
       * When the value prop changes, update
			 * the internal mutableValue.
       * @param  {mixed} val
       * @return {void}
       */
      value(val) {
				this.mutableValue = val
      },

      /**
       * Maybe run the onChange callback.
       * @param  {string|object} val
       * @param  {string|object} old
       * @return {void}
       */
			mutableValue(val, old) {
        if (this.multiple) {
          this.onChange ? this.onChange(val) : null
        } else {
          this.onChange && val !== old ? this.onChange(val) : null
        }
      },

      /**
       * When options change, update
       * the internal mutableOptions.
       * @param  {array} val
       * @return {void}
       */
      options(val) {
        this.mutableOptions = val
      },

      /**
			 * Maybe reset the mutableValue
       * when mutableOptions change.
       * @return {[type]} [description]
       */
      mutableOptions() {
        if (!this.taggable && this.resetOnOptionsChange) {
					this.mutableValue = this.multiple ? [] : null
        }
      },

      /**
			 * Always reset the mutableValue when
       * the multiple prop changes.
       * @param  {Boolean} val
       * @return {void}
       */
      multiple(val) {
				this.mutableValue = val ? [] : null
      }
    },

    /**
     * Clone props into mutable values,
     * attach any event listeners.
     */
    created() {
			this.mutableValue = this.value
      this.mutableOptions = this.options.slice(0)
			this.mutableLoading = this.loading

      this.$on('option:created', this.maybePushTag)
    },

    methods: {

      /**
       * Select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
      select(option) {
        if (this.isOptionSelected(option)) {
          this.deselect(option)
        } else {
          if (this.taggable && !this.optionExists(option)) {
            option = this.createOption(option)
          }

          if (this.multiple && !this.mutableValue) {
            this.mutableValue = [option]
          } else if (this.multiple) {
            this.mutableValue.push(option)
          } else {
            this.mutableValue = option
          }
        }

        this.onAfterSelect(option)
      },

      /**
       * De-select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
      deselect(option) {
        if (this.multiple) {
          let ref = -1
          this.mutableValue.forEach((val) => {
            if (val === option || typeof val === 'object' && val[this.label] === option[this.label]) {
              ref = val
            }
          })
          var index = this.mutableValue.indexOf(ref)
          this.mutableValue.splice(index, 1)
        } else {
          this.mutableValue = null
        }
      },

      /**
       * Called from this.select after each selection.
       * @param  {Object|String} option
       * @return {void}
       */
      onAfterSelect(option) {
        if (this.closeOnSelect) {
          this.open = !this.open
          this.$refs.search.blur()
        }

        if (this.clearSearchOnSelect) {
          this.search = ''
        }
      },

      /**
       * Toggle the visibility of the dropdown menu.
       * @param  {Event} e
       * @return {void}
       */
      toggleDropdown(e) {
        if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
          if (this.open) {
            this.$refs.search.blur() // dropdown will close on blur
          } else {
            this.open = true
            this.$refs.search.focus()
          }
        }
      },

      /**
       * Check if the given option is currently selected.
       * @param  {Object|String}  option
       * @return {Boolean}        True when selected | False otherwise
       */
      isOptionSelected(option) {
        if (this.multiple && this.mutableValue) {
          let selected = false
          this.mutableValue.forEach(opt => {
            if (typeof opt === 'object' && opt[this.label] === option[this.label]) {
              selected = true
            } else if (typeof opt === 'object' && opt[this.label] === option) {
              selected = true
            }
            else if (opt === option) {
              selected = true
            }
          })
          return selected
        }

        return this.mutableValue === option
      },

      /**
       * If there is any text in the search input, remove it.
       * Otherwise, blur the search input to close the dropdown.
       * @return {void}
       */
      onEscape() {
        if (!this.search.length) {
          this.$refs.search.blur()
        } else {
          this.search = ''
        }
      },

      /**
       * Close the dropdown on blur.
       * @emits  {search:blur}
       * @return {void}
       */
      onSearchBlur() {
        if (this.clearSearchOnBlur) {
          this.search = ''
        }
        this.open = false
        this.$emit('search:blur')
      },

      /**
       * Open the dropdown on focus.
       * @emits  {search:focus}
       * @return {void}
       */
      onSearchFocus() {
        this.open = true
        this.$emit('search:focus')
      },

      /**
       * Delete the value on Delete keypress when there is no
       * text in the search input, & there's tags to delete
       * @return {this.value}
       */
      maybeDeleteValue() {
        if (!this.$refs.search.value.length && this.mutableValue) {
          return this.multiple ? this.mutableValue.pop() : this.mutableValue = null
        }
      },

      /**
       * Determine if an option exists
       * within this.mutableOptions array.
       *
       * @param  {Object || String} option
       * @return {boolean}
       */
      optionExists(option) {
        let exists = false

        this.mutableOptions.forEach(opt => {
          if (typeof opt === 'object' && opt[this.label] === option) {
            exists = true
          } else if (opt === option) {
            exists = true
          }
        })

        return exists
      },

      /**
       * If push-tags is true, push the
       * given option to mutableOptions.
       *
       * @param  {Object || String} option
       * @return {void}
       */
      maybePushTag(option) {
        if (this.pushTags) {
          this.mutableOptions.push(option)
        }
      }
    },

    computed: {

      /**
       * Classes to be output on .dropdown
       * @return {Object}
       */
      dropdownClasses() {
        return {
          open: this.dropdownOpen,
          single: !this.multiple,
          searching: this.searching,
          searchable: this.searchable,
          unsearchable: !this.searchable,
          loading: this.mutableLoading
        }
      },

      /**
       * If search text should clear on blur
       * @return {Boolean} True when single and clearSearchOnSelect
       */
      clearSearchOnBlur() {
        return this.clearSearchOnSelect && !this.multiple
      },

      /**
       * Return the current state of the
       * search input
       * @return {Boolean} True if non empty value
       */
      searching() {
        return !!this.search
      },

      /**
       * Return the current state of the
       * dropdown menu.
       * @return {Boolean} True if open
       */
      dropdownOpen() {
        return this.noDrop ? false : this.open && !this.mutableLoading
      },

      /**
       * Return the placeholder string if it's set
       * & there is no value selected.
       * @return {String} Placeholder text
       */
      searchPlaceholder() {
        if (this.isValueEmpty && this.placeholder) {
          return this.placeholder;
        }
      },

      /**
       * The currently displayed options, filtered
       * by the search elements value. If tagging
       * true, the search text will be prepended
       * if it doesn't already exist.
       *
       * @return {array}
       */
      filteredOptions() {
        let options = this.mutableOptions.filter((option) => {
          if (typeof option === 'object' && option.hasOwnProperty(this.label)) {
            return option[this.label].toLowerCase().indexOf(this.search.toLowerCase()) > -1
          } else if (typeof option === 'object' && !option.hasOwnProperty(this.label)) {
            return console.warn(`[vue-select warn]: Label key "option.${this.label}" does not exist in options object.\nhttp://sagalbot.github.io/vue-select/#ex-labels`)
          }
          return option.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
        if (this.taggable && this.search.length && !this.optionExists(this.search)) {
          options.unshift(this.search)
        }
        return options
      },

      /**
       * Check if there aren't any options selected.
       * @return {Boolean}
       */
      isValueEmpty() {
        if (this.mutableValue) {
          if (typeof this.mutableValue === 'object') {
            return !Object.keys(this.mutableValue).length
          }
          return !this.mutableValue.length
        }

        return true;
      },

      /**
       * Return the current value in array format.
       * @return {Array}
       */
      valueAsArray() {
        if (this.multiple) {
          return this.mutableValue
        } else if (this.mutableValue) {
          return [this.mutableValue]
        }

        return []
      }
    },

  }
</script>
