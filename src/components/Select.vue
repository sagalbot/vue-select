<style lang="scss">
  @import '../scss/vue-select.scss';
</style>

<template>
  <div :dir="dir" class="v-select" :class="stateClasses">
    <slot name="header" v-bind="scope.header" />
    <div :id="`vs${uid}__combobox`" ref="toggle" @mousedown.prevent="toggleDropdown" class="vs__dropdown-toggle" role="combobox" :aria-expanded="dropdownOpen.toString()" :aria-owns="`vs${uid}__listbox`" aria-label="Search for option">

      <div class="vs__selected-options" ref="selectedOptions">
        <slot v-for="option in selectedValue"
              name="selected-option-container"
              :option="normalizeOptionForSlot(option)"
              :deselect="deselect"
              :multiple="multiple"
              :disabled="disabled">
          <span :key="getOptionKey(option)" class="vs__selected">
            <slot name="selected-option" v-bind="normalizeOptionForSlot(option)">
              {{ getOptionLabel(option) }}
            </slot>
            <button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="vs__deselect" :title="`Deselect ${getOptionLabel(option)}`" :aria-label="`Deselect ${getOptionLabel(option)}`" ref="deselectButtons">
              <component :is="childComponents.Deselect" />
            </button>
          </span>
        </slot>

        <slot name="search" v-bind="scope.search">
          <input class="vs__search" v-bind="scope.search.attributes" v-on="scope.search.events">
        </slot>
      </div>

      <div class="vs__actions" ref="actions">
        <button
          v-show="showClearButton"
          :disabled="disabled"
          @click="clearSelection"
          type="button"
          class="vs__clear"
          title="Clear Selected"
          aria-label="Clear Selected"
          ref="clearButton"
        >
          <component :is="childComponents.Deselect" />
        </button>

        <slot name="open-indicator" v-bind="scope.openIndicator">
          <component :is="childComponents.OpenIndicator" v-if="!noDrop" v-bind="scope.openIndicator.attributes"/>
        </slot>

        <slot name="spinner" v-bind="scope.spinner">
          <div class="vs__spinner" v-show="mutableLoading">Loading...</div>
        </slot>
      </div>
    </div>
    <transition :name="transition">
      <ul ref="dropdownMenu" v-if="dropdownOpen" :id="`vs${uid}__listbox`" class="vs__dropdown-menu" role="listbox" @mousedown.prevent="onMousedown" @mouseup="onMouseUp" v-append-to-body>
        <slot name="list-header" v-bind="scope.listHeader" />
        <li
          role="option"
          v-for="(option, index) in filteredOptions"
          :key="getOptionKey(option)"
          :id="`vs${uid}__option-${index}`"
          class="vs__dropdown-option"
          :class="{ 'vs__dropdown-option--selected': isOptionSelected(option), 'vs__dropdown-option--highlight': index === typeAheadPointer, 'vs__dropdown-option--disabled': !selectable(option) }"
          :aria-selected="index === typeAheadPointer ? true : null"
          @mouseover="selectable(option) ? typeAheadPointer = index : null"
          @mousedown.prevent.stop="selectable(option) ? select(option) : null"
        >
          <slot name="option" v-bind="normalizeOptionForSlot(option)">
            {{ getOptionLabel(option) }}
          </slot>
        </li>
        <li v-if="filteredOptions.length === 0" class="vs__no-options">
          <slot name="no-options" v-bind="scope.noOptions">Sorry, no matching options.</slot>
        </li>
        <slot name="list-footer" v-bind="scope.listFooter" />
      </ul>
      <ul v-else :id="`vs${uid}__listbox`" role="listbox" style="display: none; visibility: hidden;"></ul>
    </transition>
    <slot name="footer" v-bind="scope.footer" />
  </div>
</template>

<script type="text/babel">
  import pointerScroll from '../mixins/pointerScroll'
  import typeAheadPointer from '../mixins/typeAheadPointer'
  import ajax from '../mixins/ajax'
  import childComponents from './childComponents';
  import appendToBody from '../directives/appendToBody';
  import sortAndStringify from '../utility/sortAndStringify'
  import uniqueId from '../utility/uniqueId';

  /**
   * @name VueSelect
   */
  export default {
    components: {...childComponents},

    mixins: [pointerScroll, typeAheadPointer, ajax],

    directives: {appendToBody},

    props: {
      /**
       * Contains the currently selected value. Very similar to a
       * `value` attribute on an <input>. You can listen for changes
       * using 'change' event using v-on
       * @type {Object||String||null}
       */
      value: {},

      /**
       * An object with any custom components that you'd like to overwrite
       * the default implementation of in your app. The keys in this object
       * will be merged with the defaults.
       * @see https://vue-select.org/guide/components.html
       * @type {Function}
       */
      components: {
        type: Object,
        default: () => ({}),
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
       * Sets a Vue transition property on the `.vs__dropdown-menu`.
       * @type {String}
       */
      transition: {
        type: String,
        default: 'vs__fade'
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
       * When working with objects, the reduce
       * prop allows you to transform a given
       * object to only the information you
       * want passed to a v-model binding
       * or @input event.
       */
      reduce: {
        type: Function,
        default: option => option,
      },

      /**
       * Decides whether an option is selectable or not. Not selectable options
       * are displayed but disabled and cannot be selected.
       *
       * @type {Function}
       * @since 3.3.0
       * @param {Object|String} option
       * @return {Boolean}
       */
      selectable: {
        type: Function,
        default: option => true,
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
          if (typeof option === 'object') {
            if (!option.hasOwnProperty(this.label)) {
              return console.warn(
                `[vue-select warn]: Label key "option.${this.label}" does not` +
                ` exist in options object ${JSON.stringify(option)}.\n` +
                'https://vue-select.org/api/props.html#getoptionlabel'
              )
            }
            return option[this.label]
          }
          return option;
        }
      },

      /**
       * Generate a unique identifier for each option. If `option`
       * is an object and `option.hasOwnProperty('id')` exists,
       * `option.id` is used by default, otherwise the option
       * will be serialized to JSON.
       *
       * If you are supplying a lot of options, you should
       * provide your own keys, as JSON.stringify can be
       * slow with lots of objects.
       *
       * The result of this function *must* be unique.
       *
       * @type {Function}
       * @param  {Object || String} option
       * @return {String}
       */
      getOptionKey: {
        type: Function,
        default (option) {
          if (typeof option !== 'object') {
            return option;
          }

          try {
            return option.hasOwnProperty('id') ? option.id : sortAndStringify(option);
          } catch (e) {
            const warning = `[vue-select warn]: Could not stringify this option ` +
              `to generate unique key. Please provide'getOptionKey' prop ` +
              `to return a unique key for each option.\n` +
              'https://vue-select.org/api/props.html#getoptionkey';
            return console.warn(warning, option, e);
          }
        },
      },

      /**
       * Select the current value if selectOnTab is enabled
       * @deprecated since 3.3
       */
      onTab: {
        type: Function,
        default: function () {
          if (this.selectOnTab && !this.isComposing) {
            this.typeAheadSelect();
          }
        },
      },

      /**
       * Enable/disable creating options from searchEl.
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
        type: Function,
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
        default (option) {
          return (typeof this.optionList[0] === 'object') ? {[this.label]: option} : option;
        },
      },

      /**
       * When false, updating the options will not reset the selected value. Accepts
       * a `boolean` or `function` that returns a `boolean`. If defined as a function,
       * it will receive the params listed below.
       *
       * @since 3.4 - Type changed to {Boolean|Function}
       *
       * @type {Boolean|Function}
       * @param {Array} newOptions
       * @param {Array} oldOptions
       * @param {Array} selectedValue
       */
      resetOnOptionsChange: {
        default: false,
        validator: (value) => ['function', 'boolean'].includes(typeof value)
      },

      /**
       * If search text should clear on blur
       * @return {Boolean} True when single and clearSearchOnSelect
       */
      clearSearchOnBlur: {
        type: Function,
        default: function ({ clearSearchOnSelect, multiple }) {
          return clearSearchOnSelect && !multiple
        }
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
       * @deprecated since 3.3 - use selectOnKeyCodes instead
       */
      selectOnTab: {
        type: Boolean,
        default: false
      },

      /**
       * Keycodes that will select the current option.
       * @type Array
       */
      selectOnKeyCodes: {
        type: Array,
        default: () => [13],
      },

      /**
       * Query Selector used to find the search input
       * when the 'search' scoped slot is used.
       *
       * Must be a valid CSS selector string.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
       * @type {String}
       */
      searchInputQuerySelector: {
        type: String,
        default: '[type=search]'
      },

      /**
       * Used to modify the default keydown events map
       * for the search input. Can be used to implement
       * custom behaviour for key presses.
       */
      mapKeydown: {
        type: Function,
        /**
         * @param map {Object}
         * @param vm {VueSelect}
         * @return {Object}
         */
        default: (map, vm) => map,
      },

      /**
       * Append the dropdown element to the end of the body
       * and size/position it dynamically. Use it if you have
       * overflow or z-index issues.
       * @type {Boolean}
       */
      appendToBody: {
        type: Boolean,
        default: false
      },

      /**
       * When `appendToBody` is true, this function is responsible for
       * positioning the drop down list.
       *
       * If a function is returned from `calculatePosition`, it will
       * be called when the drop down list is removed from the DOM.
       * This allows for any garbage collection you may need to do.
       *
       * @since v3.7.0
       * @see http://vue-select.org/guide/positioning.html
       */
      calculatePosition: {
        type: Function,
        /**
         * @param dropdownList {HTMLUListElement}
         * @param component {Vue} current instance of vue select
         * @param width {string} calculated width in pixels of the dropdown menu
         * @param top {string} absolute position top value in pixels relative to the document
         * @param left {string} absolute position left value in pixels relative to the document
         * @return {function|void}
         */
        default(dropdownList, component, {width, top, left}) {
          dropdownList.style.top = top;
          dropdownList.style.left = left;
          dropdownList.style.width = width;
        }
      }
    },

    data() {
      return {
        uid: uniqueId(),
        search: '',
        open: false,
        isComposing: false,
        pushedTags: [],
        _value: [] // Internal value managed by Vue Select if no `value` prop is passed
      }
    },

    watch: {
      /**
       * Maybe reset the value
       * when options change.
       * Make sure selected option
       * is correct.
       * @return {[type]} [description]
       */
      options (newOptions, oldOptions) {
        let shouldReset = () => typeof this.resetOnOptionsChange === 'function'
          ? this.resetOnOptionsChange(newOptions, oldOptions, this.selectedValue)
          : this.resetOnOptionsChange;

        if (!this.taggable && shouldReset()) {
          this.clearSelection();
        }

        if (this.value && this.isTrackingValues) {
          this.setInternalValueFromOptions(this.value);
        }
      },

      /**
       * Make sure to update internal
       * value if prop changes outside
       */
      value(val) {
        if (this.isTrackingValues) {
          this.setInternalValueFromOptions(val)
        }
      },

      /**
       * Always reset the value when
       * the multiple prop changes.
       * @param  {Boolean} isMultiple
       * @return {void}
       */
      multiple() {
        this.clearSelection()
      },

      open(isOpen) {
        this.$emit(isOpen ? 'open' : 'close');
      }
    },

    created() {
      this.mutableLoading = this.loading;

      if (typeof this.value !== "undefined" && this.isTrackingValues) {
        this.setInternalValueFromOptions(this.value)
      }

      this.$on('option:created', this.pushTag)
    },

    methods: {
      /**
       * Make sure tracked value is
       * one option if possible.
       * @param  {Object|String} value
       * @return {void}
       */
      setInternalValueFromOptions(value) {
        if (Array.isArray(value)) {
          this.$data._value = value.map(val => this.findOptionFromReducedValue(val));
        } else {
          this.$data._value = this.findOptionFromReducedValue(value);
        }
      },

      /**
       * Select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
      select(option) {
        if (!this.isOptionSelected(option)) {
          if (this.taggable && !this.optionExists(option)) {
            this.$emit('option:created', option);
          }
          if (this.multiple) {
            option = this.selectedValue.concat(option)
          }
          this.updateValue(option);
        }
        this.onAfterSelect(option)
      },

      /**
       * De-select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
      deselect (option) {
        this.updateValue(this.selectedValue.filter(val => {
          return !this.optionComparator(val, option);
        }));
      },

      /**
       * Clears the currently selected value(s)
       * @return {void}
       */
      clearSelection() {
        this.updateValue(this.multiple ? [] : null)
      },

      /**
       * Called from this.select after each selection.
       * @param  {Object|String} option
       * @return {void}
       */
      onAfterSelect(option) {
        if (this.closeOnSelect) {
          this.open = !this.open
          this.searchEl.blur()
        }

        if (this.clearSearchOnSelect) {
          this.search = ''
        }
      },

      /**
       * Accepts a selected value, updates local
       * state when required, and triggers the
       * input event.
       *
       * @emits input
       * @param value
       */
      updateValue (value) {
        if (this.isTrackingValues) {
          // Vue select has to manage value
          this.$data._value = value;
        }

        if (value !== null) {
          if (Array.isArray(value)) {
            value = value.map(val => this.reduce(val));
          } else {
            value = this.reduce(value);
          }
        }

        this.$emit('input', value);
      },

      /**
       * Toggle the visibility of the dropdown menu.
       * @param  {Event} e
       * @return {void}
       */
      toggleDropdown ({target}) {
        //  don't react to click on deselect/clear buttons,
        //  they dropdown state will be set in their click handlers
        const ignoredButtons = [
          ...(this.$refs['deselectButtons'] || []),
          ...([this.$refs['clearButton']] || [])
        ];

        if (ignoredButtons.some(ref => ref.contains(target) || ref === target)) {
          return;
        }

        if (this.open) {
          this.searchEl.blur();
        } else if (!this.disabled) {
          this.open = true;
          this.searchEl.focus();
        }
      },

      /**
       * Check if the given option is currently selected.
       * @param  {Object|String}  option
       * @return {Boolean}        True when selected | False otherwise
       */
      isOptionSelected(option) {
        return this.selectedValue.some(value => this.optionComparator(value, option))
      },

      /**
       * Determine if two option objects are matching.
       *
       * @param a {Object}
       * @param b {Object}
       * @returns {boolean}
       */
      optionComparator(a, b) {
        return this.getOptionKey(a) === this.getOptionKey(b);
      },

      /**
       * Finds an option from the options
       * where a reduced value matches
       * the passed in value.
       *
       * @param value {Object}
       * @returns {*}
       */
      findOptionFromReducedValue (value) {
        const predicate = option => JSON.stringify(this.reduce(option)) === JSON.stringify(value);

        const matches = [
          ...this.options,
          ...this.pushedTags,
        ].filter(predicate);

        if (matches.length === 1) {
          return matches[0];
        }

        /**
         * This second loop is needed to cover an edge case where `taggable` + `reduce`
         * were used in conjunction with a `create-option` that doesn't create a
         * unique reduced value.
         * @see https://github.com/sagalbot/vue-select/issues/1089#issuecomment-597238735
         */
        return matches.find(match => this.optionComparator(match, this.$data._value)) || value;
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
       * Delete the value on Delete keypress when there is no
       * text in the search input, & there's tags to delete
       * @return {this.value}
       */
      maybeDeleteValue() {
        if (!this.searchEl.value.length && this.selectedValue && this.selectedValue.length && this.clearable) {
          let value = null;
          if (this.multiple) {
            value = [...this.selectedValue.slice(0, this.selectedValue.length - 1)]
          }
          this.updateValue(value)
        }
      },

      /**
       * Determine if an option exists
       * within this.optionList array.
       *
       * @param  {Object || String} option
       * @return {boolean}
       */
      optionExists(option) {
        return this.optionList.some(_option => this.optionComparator(_option, option))
      },

      /**
       * Ensures that options are always
       * passed as objects to scoped slots.
       * @param option
       * @return {*}
       */
      normalizeOptionForSlot (option) {
        return (typeof option === 'object') ? option : {[this.label]: option};
      },

      /**
       * If push-tags is true, push the
       * given option to `this.pushedTags`.
       *
       * @param  {Object || String} option
       * @return {void}
       */
      pushTag (option) {
        this.pushedTags.push(option);
      },

      /**
       * If there is any text in the search input, remove it.
       * Otherwise, blur the search input to close the dropdown.
       * @return {void}
       */
      onEscape() {
        if (!this.search.length) {
          this.searchEl.blur()
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
          const { clearSearchOnSelect, multiple } = this;
          if (this.clearSearchOnBlur({ clearSearchOnSelect, multiple })) {
            this.search = ''
          }
          this.closeSearchOptions()
          return
        }
        // Fixed bug where no-options message could not be closed
        if (this.search.length === 0 && this.options.length === 0){
          this.closeSearchOptions()
          return
        }
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
       * Event-Handler to help workaround IE11 (probably fixes 10 as well)
       * firing a `blur` event when clicking
       * the dropdown's scrollbar, causing it
       * to collapse abruptly.
       * @see https://github.com/sagalbot/vue-select/issues/106
       * @return {void}
       */
      onMousedown() {
        this.mousedown = true
      },

      /**
       * Event-Handler to help workaround IE11 (probably fixes 10 as well)
       * @see https://github.com/sagalbot/vue-select/issues/106
       * @return {void}
       */
      onMouseUp() {
        this.mousedown = false
      },

      /**
       * Search <input> KeyBoardEvent handler.
       * @param e {KeyboardEvent}
       * @return {Function}
       */
      onSearchKeyDown (e) {
        const preventAndSelect = e => {
          e.preventDefault();
          return !this.isComposing && this.typeAheadSelect();
        };

        const defaults = {
          //  backspace
          8: e => this.maybeDeleteValue(),
          //  tab
          9: e => this.onTab(),
          //  esc
          27: e => this.onEscape(),
          //  up.prevent
          38: e => {
            e.preventDefault();
            return this.typeAheadUp();
          },
          //  down.prevent
          40: e => {
            e.preventDefault();
            return this.typeAheadDown();
          },
        };

        this.selectOnKeyCodes.forEach(keyCode => defaults[keyCode] = preventAndSelect);

        const handlers = this.mapKeydown(defaults, this);

        if (typeof handlers[e.keyCode] === 'function') {
          return handlers[e.keyCode](e);
        }
      }
    },

    computed: {
      /**
       * Determine if the component needs to
       * track the state of values internally.
       * @return {boolean}
       */
      isTrackingValues () {
        return typeof this.value === 'undefined' || this.$options.propsData.hasOwnProperty('reduce');
      },

      /**
       * The options that are currently selected.
       * @return {Array}
       */
      selectedValue () {
        let value = this.value;

        if (this.isTrackingValues) {
          // Vue select has to manage value internally
          value = this.$data._value;
        }

        if (value) {
          return [].concat(value);
        }

        return [];
      },

      /**
       * The options available to be chosen
       * from the dropdown, including any
       * tags that have been pushed.
       *
       * @return {Array}
       */
      optionList () {
        return this.options.concat(this.pushTags ? this.pushedTags : []);
      },

      /**
       * Find the search input DOM element.
       * @returns {HTMLInputElement}
       */
      searchEl () {
        return !!this.$scopedSlots['search']
          ? this.$refs.selectedOptions.querySelector(this.searchInputQuerySelector)
          : this.$refs.search;
      },

      /**
       * The object to be bound to the $slots.search scoped slot.
       * @returns {Object}
       */
      scope () {
        const listSlot = {
          search: this.search,
          loading: this.loading,
          searching: this.searching,
          filteredOptions: this.filteredOptions
        };
        return {
          search: {
            attributes: {
              'disabled': this.disabled,
              'placeholder': this.searchPlaceholder,
              'tabindex': this.tabindex,
              'readonly': !this.searchable,
              'id': this.inputId,
              'aria-autocomplete': 'list',
              'aria-labelledby': `vs${this.uid}__combobox`,
              'aria-controls': `vs${this.uid}__listbox`,
              'aria-activedescendant': this.typeAheadPointer > -1 ? `vs${this.uid}__option-${this.typeAheadPointer}` : '',
              'ref': 'search',
              'type': 'search',
              'autocomplete': this.autocomplete,
              'value': this.search,
            },
            events: {
              'compositionstart': () => this.isComposing = true,
              'compositionend': () => this.isComposing = false,
              'keydown': this.onSearchKeyDown,
              'blur': this.onSearchBlur,
              'focus': this.onSearchFocus,
              'input': (e) => this.search = e.target.value,
            },
          },
          spinner: {
            loading: this.mutableLoading
          },
          noOptions: {
            search: this.search,
            loading: this.loading,
            searching: this.searching,
          },
          openIndicator: {
            attributes: {
              'ref': 'openIndicator',
              'role': 'presentation',
              'class': 'vs__open-indicator',
            },
          },
          listHeader: listSlot,
          listFooter: listSlot,
          header: { ...listSlot, deselect: this.deselect },
          footer: { ...listSlot, deselect: this.deselect }
        };
      },

      /**
       * Returns an object containing the child components
       * that will be used throughout the component. The
       * `component` prop can be used to overwrite the defaults.
       *
       * @return {Object}
       */
      childComponents () {
        return {
          ...childComponents,
          ...this.components
        };
      },

      /**
       * Holds the current state of the component.
       * @return {Object}
       */
      stateClasses() {
        return {
          'vs--open': this.dropdownOpen,
          'vs--single': !this.multiple,
          'vs--searching': this.searching && !this.noDrop,
          'vs--searchable': this.searchable && !this.noDrop,
          'vs--unsearchable': !this.searchable,
          'vs--loading': this.mutableLoading,
          'vs--disabled': this.disabled
        }
      },

      /**
       * Return the current state of the
       * search input
       * @return {Boolean} True if non empty value
       */
      searching() {
        return !! this.search
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
        const optionList = [].concat(this.optionList);

        if (!this.filterable && !this.taggable) {
          return optionList;
        }

        let options = this.search.length ? this.filter(optionList, this.search, this) : optionList;
        if (this.taggable && this.search.length && !this.optionExists(this.createOption(this.search))) {
          options.unshift(this.search)
        }
        return options
      },

      /**
       * Check if there aren't any options selected.
       * @return {Boolean}
       */
      isValueEmpty() {
        return this.selectedValue.length === 0;
      },

      /**
       * Determines if the clear button should be displayed.
       * @return {Boolean}
       */
      showClearButton() {
        return !this.multiple && this.clearable && !this.open && !this.isValueEmpty
      },
    },

  }
</script>
