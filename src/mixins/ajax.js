module.exports = {
	props: {
		/**
		 * Toggles the adding of a 'loading' class to the main
		 * .v-select wrapper. Useful to control UI state when
		 * results are being processed through AJAX.
		 */
		loading: {
			type: Boolean,
			default: false
		},

		/**
		 * Accept a callback function that will be
		 * run when the search text changes.
		 *
		 * loading() accepts a boolean value, and can
		 * be used to toggle a loading class from
		 * the onSearch callback.
		 *
		 * @param {search}  String          Current search text
		 * @param {loading} Function(bool)  Toggle loading class
		 */
		onSearch: {
			type: Function,
			default: function(search, loading){}
		}
	},

	data() {
		return {
      mutableLoading: false
    }
	},

	watch: {
		/**
		 * If a callback & search text has been provided,
		 * invoke the onSearch callback.
		 */
		search() {
			this.onSearch(this.search, this.toggleLoading)
			this.$emit('search', this.search, this.toggleLoading)
		},
    /**
		 * Sync the loading prop with the internal
		 * mutable loading value.
     * @param val
     */
		loading(val) {
			this.mutableLoading = val
		}
	},

	methods: {
		/**
		 * Toggle this.loading. Optionally pass a boolean
		 * value. If no value is provided, this.loading
		 * will be set to the opposite of it's current value.
		 * @param toggle Boolean
		 * @returns {*}
		 */
		toggleLoading(toggle = null) {
			if (toggle == null) {
				return this.mutableLoading = !this.mutableLoading
			}
			return this.mutableLoading = toggle
		}
	}
}
