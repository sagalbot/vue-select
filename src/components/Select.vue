<style>
  .v-select {
    position: relative;
    font-family: inherit;
  }
  .v-select,
  .v-select * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Rtl support - Because we're using a flexbox-based layout, the `dir="rtl"` HTML
     attribute does most of the work for us by rearranging the child elements visually.
   */
  .v-select[dir="rtl"] .vs__actions {
    padding: 0 3px 0 6px;
  }
  .v-select[dir="rtl"] .dropdown-toggle .clear {
    margin-left: 6px;
    margin-right: 0;
  }
  .v-select[dir="rtl"] .selected-tag .close {
    margin-left: 0;
    margin-right: 2px;
  }
  .v-select[dir="rtl"] .dropdown-menu {
    text-align: right;
  }

  /* Open Indicator */
  .v-select .open-indicator {
    display: flex;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    opacity: 1;
    width: 12px; /* To account for extra width from rotating. */
  }
  .v-select .open-indicator:before {
    border-color: rgba(60, 60, 60, .5);
    border-style: solid;
    border-width: 3px 3px 0 0;
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    vertical-align: text-top;
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

  /* Dropdown Toggle */
  .v-select .dropdown-toggle {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: flex;
    padding: 0 0 4px 0;
    background: none;
    border: 1px solid rgba(60, 60, 60, .26);
    border-radius: 4px;
    white-space: normal;
  }
  .v-select .dropdown-toggle::after {
    display: none;
  }
  .v-select .vs__selected-options {
    display: flex;
    flex-basis: 100%;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0 2px;
    position: relative;
  }
  .v-select .vs__actions {
    display: flex;
    align-items: stretch;
    padding: 0 6px 0 3px;
  }

  /* Clear Button */
  .v-select .dropdown-toggle .clear {
    font-size: 23px;
    font-weight: 700;
    line-height: 1;
    color: rgba(60, 60, 60, 0.5);
    padding: 0;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    margin-right: 6px;
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
    overflow-y: auto;
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
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #333;
    line-height: 1.42857143; /* Normalize line height */
    margin: 4px 2px 0px 2px;
    padding: 0 0.25em;
    transition: opacity .25s;
  }
  .v-select.single .selected-tag {
    background-color: transparent;
    border-color: transparent;
  }
  .v-select.single.open .selected-tag {
    position: absolute;
    opacity: .4;
  }
  .v-select.single.searching .selected-tag {
    display: none;
  }
  .v-select .selected-tag .close {
    margin-left: 2px;
    font-size: 1.25em;
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
    font-size: 1em;
    display: inline-block;
    border: 1px solid transparent;
    border-left: none;
    outline: none;
    margin: 4px 0 0 0;
    padding: 0 7px;
    max-width: 100%;
    background: none;
    box-shadow: none;
    flex-grow: 1;
    width: 0;
    height: inherit;
  }
  .v-select.unsearchable input[type="search"] {
    opacity: 1;
  }
  .v-select.unsearchable input[type="search"]:hover {
    cursor: pointer;
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
    align-self: center;
    opacity: 0;
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

  /* Disabled state */
  .v-select.disabled .dropdown-toggle,
  .v-select.disabled .dropdown-toggle .clear,
  .v-select.disabled .dropdown-toggle input,
  .v-select.disabled .selected-tag .close,
  .v-select.disabled .open-indicator {
    cursor: not-allowed;
    background-color: rgb(248, 248, 248);
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
  <div :dir="dir" class="dropdown v-select" :class="dropdownClasses">
    <div ref="toggle" @mousedown.prevent="toggleDropdown" class="dropdown-toggle">

      <div class="vs__selected-options" ref="selectedOptions">
        <slot v-for="option in valueAsArray" name="selected-option-container"
              :option="(typeof option === 'object')?option:{[label]: option}" :deselect="deselect" :multiple="multiple" :disabled="disabled">
          <span class="selected-tag" v-bind:key="option.index">
            <slot name="selected-option" v-bind="(typeof option === 'object')?option:{[label]: option}">
              {{ getOptionLabel(option) }}
            </slot>
            <button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="close" aria-label="Remove option">
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </slot>

        <input
                ref="search"
                :value="search"
                @keydown.delete="maybeDeleteValue"
                @keyup.esc="onEscape"
                @keydown.up.prevent="typeAheadUp"
                @keydown.down.prevent="typeAheadDown"
                @keydown.enter.prevent="typeAheadSelect"
                @keydown.tab="onTab"
                @blur="onSearchBlur"
                @focus="onSearchFocus"
                @input="search = $event.target.value"
                type="search"
                class="form-control"
                :autocomplete="autocomplete"
                :disabled="disabled"
                :placeholder="searchPlaceholder"
                :tabindex="tabindex"
                :readonly="!searchable"
                :id="inputId"
                role="combobox"
                :aria-expanded="dropdownOpen"
                aria-label="Search for option"
        >

      </div>
      <div class="vs__actions">
        <button
          v-show="showClearButton"
          :disabled="disabled"
          @click="clearSelection"
          type="button"
          class="clear"
          title="Clear selection"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <i v-if="!noDrop" ref="openIndicator" role="presentation" class="open-indicator"></i>

        <slot name="spinner">
          <div class="spinner" v-show="mutableLoading">Loading...</div>
        </slot>
      </div>
    </div>

    <transition :name="transition">
      <ul ref="dropdownMenu" v-if="dropdownOpen" class="dropdown-menu" :style="{ 'max-height': maxHeight }" role="listbox" @mousedown="onMousedown" @mouseup="onMouseup">
        <li role="option" v-for="(option, index) in filteredOptions" v-bind:key="index" :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }" @mouseover="typeAheadPointer = index">
          <a @mousedown.prevent.stop="select(option)">
          <slot name="option" v-bind="(typeof option === 'object')?option:{[label]: option}">
            {{ getOptionLabel(option) }}
          </slot>
          </a>
        </li>
        <li v-if="!filteredOptions.length" class="no-options" @mousedown.stop="">
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
       * @type {Array}
       */
      options: {
        type: Array,
        default() {
          return []
        },
      },

      /**
       * Disable the entire component.
       * @type {Boolean}
       */
      disabled: {
        type: Boolean,
        default: false
      },

      /**
       * Can the user clear the selected property.
       * @type {Boolean}
       */
      clearable: {
        type: Boolean,
        default: true
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
       * @type {Boolean}
       */
      multiple: {
        type: Boolean,
        default: false
      },

      /**
       * Equivalent to the `placeholder` attribute on an `<input>`.
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
       * Value of the 'autocomplete' field of the input
       * element.
       * @type {String}
       */
      autocomplete: {
        type: String,
        default: 'off'
      },

      /**
       * Tells vue-select what key to use when generating option
       * values when each `option` is an object.
       * @type {String}
       */
      index: {
        type: String,
        default: null
      },

      /**
       * Callback to generate the label text. If {option}
       * is an object, returns option[this.label] by default.
       *
       * Label text is used for filtering comparison and
       * displaying. If you only need to adjust the
       * display, you should use the `option` and
       * `selected-option` slots.
       *
       * @type {Function}
       * @param  {Object || String} option
       * @return {String}
       */
      getOptionLabel: {
        type: Function,
        default(option) {
          if( this.index ) {
            option = this.findOptionByIndexValue(option)
          }

          if (typeof option === 'object') {
            if (!option.hasOwnProperty(this.label)) {
              return console.warn(
                `[vue-select warn]: Label key "option.${this.label}" does not` +
                ` exist in options object ${JSON.stringify(option)}.\n` +
                'http://sagalbot.github.io/vue-select/#ex-labels'
              )
            }
            return option[this.label]
          }
          return option;
        }
      },

      /**
       * An optional callback function that is called each time the selected
       * value(s) change. When integrating with Vuex, use this callback to trigger
       * an action, rather than using :value.sync to retreive the selected value.
       * @type {Function}
       * @param {Object || String} val
       */
      onChange: {
        type: Function,
        default: function (val) {
          this.$emit('change', val);
        }
      },

      onInput: {
        type: Function,
        default: function (val) {
          this.$emit('input', val);
        }
      },

      /**
       * Select the current value if selectOnTab is enabled
       */
      onTab: {
        type: Function,
        default: function () {
          if (this.selectOnTab) {
            this.typeAheadSelect();
          }
        },
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
       * Set the tabindex for the input field.
       * @type {Number}
       */
      tabindex: {
        type: Number,
        default: null
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
       * When true, existing options will be filtered
       * by the search text. Should not be used in conjunction
       * with taggable.
       * @type {Boolean}
       */
      filterable: {
        type: Boolean,
        default: true
      },

      /**
       * Callback to determine if the provided option should
       * match the current search text. Used to determine
       * if the option should be displayed.
       * @type   {Function}
       * @param  {Object || String} option
       * @param  {String} label
       * @param  {String} search
       * @return {Boolean}
       */
      filterBy: {
        type: Function,
        default(option, label, search) {
          return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1
        }
      },

      /**
       * Callback to filter results when search text
       * is provided. Default implementation loops
       * each option, and returns the result of
       * this.filterBy.
       * @type   {Function}
       * @param  {Array} list of options
       * @param  {String} search text
       * @param  {Object} vSelect instance
       * @return {Boolean}
       */
      filter: {
        "type": Function,
        default(options, search) {
          return options.filter((option) => {
            let label = this.getOptionLabel(option)
            if (typeof label === 'number') {
              label = label.toString()
            }
            return this.filterBy(option, label, search)
          });
        }
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

      /**
       * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
       * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
       * @type {String}
       * @default 'auto'
       */
      dir: {
        type: String,
        default: 'auto'
      },
      /**
       * When true, hitting the 'tab' key will select the current select value
       * @type {Boolean}
       */
      selectOnTab: {
        type: Boolean,
        default: false
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
        if (!this.isOptionSelected(option)) {
          if (this.taggable && !this.optionExists(option)) {
            option = this.createOption(option)
          }
          if(this.index) {
            if (!option.hasOwnProperty(this.index)) {
              return console.warn(
                  `[vue-select warn]: Index key "option.${this.index}" does not` +
                  ` exist in options object ${JSON.stringify(option)}.`
              )
            }
            option = option[this.index]
          }
          if (this.multiple && !this.mutableValue) {
            this.mutableValue = [option]
          } else if (this.multiple) {
            this.mutableValue = [...this.mutableValue, option]
          } else {
            this.mutableValue = option
          }
          this.onInput(this.mutableValue);
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
            if (val === option || (this.index && val === option[this.index]) || (typeof val === 'object' && val[this.label] === option[this.label])) {
              ref = val
            }
          })
          this.mutableValue = this.mutableValue.filter(entry => entry !== ref)
        } else {
          this.mutableValue = null
        }
        this.onInput(this.mutableValue);
      },

      /**
       * Clears the currently selected value(s)
       * @return {void}
       */
      clearSelection() {
        this.mutableValue = this.multiple ? [] : null
        this.onInput(this.mutableValue)
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
        if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle ||
            e.target.classList.contains('selected-tag') || e.target === this.$el) {
          if (this.open) {
            this.$refs.search.blur() // dropdown will close on blur
          } else {
            if (!this.disabled) {
              this.open = true
              this.$refs.search.focus()
            }
          }
        }
      },

      /**
       * Check if the given option is currently selected.
       * @param  {Object|String}  option
       * @return {Boolean}        True when selected | False otherwise
       */
      isOptionSelected(option) {
        return this.valueAsArray.some(value => {
          if (typeof value === 'object') {
            return this.optionObjectComparator(value, option)
          }
          return value === option || value === option[this.index]
        })
      },

      /**
       * Determine if two option objects are matching.
       *
       * @param value {Object}
       * @param option {Object}
       * @returns {boolean}
       */
      optionObjectComparator(value, option) {
        if (this.index && value === option[this.index]) {
          return true
        } else if ((value[this.label] === option[this.label]) || (value[this.label] === option)) {
          return true
        } else if (this.index && value[this.index] === option[this.index]) {
          return true
        }
        return false;
      },

      /**
       * Finds an option from this.options
       * where option[this.index] matches
       * the passed in value.
       *
       * @param value {Object}
       * @returns {*}
       */
      findOptionByIndexValue(value) {
        this.options.forEach(_option => {
          if (JSON.stringify(_option[this.index]) === JSON.stringify(value)) {
            value = _option
          }
        })
        return value
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
        if (this.mousedown && !this.searching) {
          this.mousedown = false
        } else {
          if (this.clearSearchOnBlur) {
            this.search = ''
          }
          this.closeSearchOptions()
          return
        }
        // Fixed bug where no-options message could not be closed
        if(this.search.length === 0 && this.options.length === 0){
          this.closeSearchOptions()
          return
        }
      },

      /**
       * 'Private' function to close the search options
       * @emits  {search:blur}
       * @returns {void}
       */
      closeSearchOptions(){
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
        if (!this.$refs.search.value.length && this.mutableValue && this.clearable) {
          this.mutableValue = this.multiple ? this.mutableValue.slice(0, -1) : null
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
      },

      /**
       * Event-Handler to help workaround IE11 (probably fixes 10 as well)
       * firing a `blur` event when clicking
       * the dropdown's scrollbar, causing it
       * to collapse abruptly.
       * @return {void}
       */
      onMousedown() {
        this.mousedown = true
      },

      onMouseup() {
        this.mousedown = false
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
          loading: this.mutableLoading,
          rtl: this.dir === 'rtl', // This can be removed - styling is handled by `dir="rtl"` attribute
          disabled: this.disabled
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
        if (!this.filterable && !this.taggable) {
          return this.mutableOptions.slice()
        }
        let options = this.search.length ? this.filter(this.mutableOptions, this.search, this) : this.mutableOptions;
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
            return ! Object.keys(this.mutableValue).length
          }
          return ! this.valueAsArray.length
        }

        return true;
      },

      /**
       * Return the current value in array format.
       * @return {Array}
       */
      valueAsArray() {
        if (this.multiple && this.mutableValue) {
          return this.mutableValue
        } else if (this.mutableValue) {
          return [].concat(this.mutableValue)
        }

        return []
      },

      /**
       * Determines if the clear button should be displayed.
       * @return {Boolean}
       */
      showClearButton() {
        return !this.multiple && this.clearable && !this.open && this.mutableValue != null
      }
    },

  }
</script>
