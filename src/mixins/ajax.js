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
		},

		/**
		 * The number of milliseconds to wait before
		 * invoking this.onSearch(). Used to prevent
		 * sending an AJAX request until input is complete.
		 */
		debounce: {
			type: Number,
			default: 0
		}
	},

	watch: {
		/**
		 * If a callback & search text has been provided,
		 * invoke the onSearch callback.
		 */
		search() {
			if (this.search.length > 0 && this.onSearch) {
				this.onSearch(this.search, this.toggleLoading)
			}
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
		toggleLoading(toggle = null) {
			if (toggle == null) {
				return this.loading = !this.loading
			}
			return this.loading = toggle
		}
	}
}