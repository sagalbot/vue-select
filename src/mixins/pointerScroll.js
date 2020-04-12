export default {
  props: {
    autoscroll: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    typeAheadPointer() {
      if (this.autoscroll) {
        this.maybeAdjustScroll();
      }
    },
  },

  methods: {
    /**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
    maybeAdjustScroll() {
      const optionEl =
        this.$refs.dropdownMenu?.children[this.typeAheadPointer] || false;

      if (optionEl) {
        const bounds = this.getDropdownViewport();
        const { top, bottom, height } = optionEl.getBoundingClientRect();

        if (top < bounds.top) {
          return (this.$refs.dropdownMenu.scrollTop = optionEl.offsetTop);
        } else if (bottom > bounds.bottom) {
          return (this.$refs.dropdownMenu.scrollTop =
            optionEl.offsetTop - (bounds.height - height));
        }
      }
    },

    /**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
    getDropdownViewport() {
      return this.$refs.dropdownMenu
        ? this.$refs.dropdownMenu.getBoundingClientRect()
        : {
            height: 0,
            top: 0,
            bottom: 0
          };
    }
  }
};
