module.exports = {
  watch: {
    typeAheadPointer() {
      this.maybeAdjustScroll()
    }
  },

  methods: {
    /**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
    maybeAdjustScroll() {
      let pixelsToPointerTop = this.pixelsToPointerTop()
      let pixelsToPointerBottom = this.pixelsToPointerBottom()

      if ( pixelsToPointerTop <= this.viewport().top) {
        return this.scrollTo( pixelsToPointerTop )
      } else if (pixelsToPointerBottom >= this.viewport().bottom) {
        return this.scrollTo( this.viewport().top + this.pointerHeight() )
      }
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the top of the current pointer element.
     * @returns {number}
     */
    pixelsToPointerTop() {
      let pixelsToPointerTop = 0
      if (this.$refs['dropdown-menu'] && this.$refs['dropdown-menu'].children) {
        for (let i = 0; i < this.typeAheadPointer; i++) {
          pixelsToPointerTop += this.$refs['dropdown-menu'].children[i].offsetHeight
        }
      }
      return pixelsToPointerTop
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the bottom of the current pointer element.
     * @returns {*}
     */
    pixelsToPointerBottom() {
      return this.pixelsToPointerTop() + this.pointerHeight()
    },

    /**
     * The offsetHeight of the current pointer element.
     * @returns {number}
     */
    pointerHeight() {
      const element = (this.$refs['dropdown-menu'] && this.$refs['dropdown-menu'].children) ? this.$refs['dropdown-menu'].children[this.typeAheadPointer] : undefined
      return element ? element.offsetHeight : 0
    },

    /**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
    viewport() {
      if (this.$refs['dropdown-menu']) {
        return {
          top: this.$refs['dropdown-menu'].scrollTop,
          bottom: this.$refs['dropdown-menu'].offsetHeight + this.$refs['dropdown-menu'].scrollTop
        }
      } else {
        return { top: 0, bottom: 0 }
      }
    },

    /**
     * Scroll the dropdownMenu to a given position.
     * @param position
     * @returns {*}
     */
    scrollTo(position) {
      if (this.$refs['dropdown-menu']) {
        return this.$refs['dropdown-menu'].scrollTop = position
      } else {
        return 0;
      }
    },
  }
}
