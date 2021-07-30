export default {
  data() {
    return {
      typeAheadPointer: -1,
    }
  },

  watch: {
    filteredOptions() {
      for (let i = 0; i < this.filteredOptions.length; i++) {
        if (this.selectable(this.filteredOptions[i])) {
          this.typeAheadPointer = i
          break
        }
      }
    },
  },

  methods: {
    /**
     * Move the typeAheadPointer visually up the list by
     * setting it to the previous selectable option.
     * @return {void}
     */
    typeAheadUp() {
      for (let i = this.typeAheadPointer - 1; i >= 0; i--) {
        if (this.selectable(this.filteredOptions[i])) {
          this.typeAheadPointer = i
          break
        }
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * setting it to the next selectable option.
     * @return {void}
     */
    typeAheadDown() {
      for (
        let i = this.typeAheadPointer + 1;
        i < this.filteredOptions.length;
        i++
      ) {
        if (this.selectable(this.filteredOptions[i])) {
          this.typeAheadPointer = i
          break
        }
      }
    },

    /**
     * Select the option at the current typeAheadPointer position.
     * Optionally clear the search input on selection.
     * @return {void}
     */
    typeAheadSelect() {
      const typeAheadOption = this.filteredOptions[this.typeAheadPointer]

      if (typeAheadOption) {
        this.select(typeAheadOption)
      }
    },
  },
}
