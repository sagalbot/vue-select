export default {
  props: {
    /**
     * Toggles the adding of a 'loading' class to the main
     * .v-select wrapper. Useful to control UI state when
     * results are being processed through AJAX.
     */
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      mutableLoading: false,
    };
  },

  watch: {
    /**
     * Anytime the search string changes, emit the
     * 'search' event. The event is passed with two
     * parameters: the search string, and a function
     * that accepts a boolean parameter to toggle the
     * loading state.
     *
     * @emits search
     */
    search () {
      const search = this.search;
      const toggleLoading = this.toggleLoading;
      /**
       * Triggered anytime the search text has been altered in any way,
       * including being set to an empty string. Your listener should
       * account for empty search strings.
       *
       * @param {String} search - the current search text
       * @param {Function} toggleLoading - accepts true/false to toggle loading state
       */
      this.$emit('search', search, toggleLoading);
    },

    /**
     * Sync the loading prop with the internal
     * mutable loading value.
     * @param val
     */
    loading (val) {
      this.mutableLoading = val;
    },
  },

  methods: {
    /**
     * Toggle this.loading. Optionally pass a boolean
     * value. If no value is provided, this.loading
     * will be set to the opposite of it's current value.
     * @param toggle Boolean
     * @returns {*}
     */
    toggleLoading (toggle = null) {
      if (toggle == null) {
        return (this.mutableLoading = !this.mutableLoading);
      }
      return (this.mutableLoading = toggle);
    },
  },
};
