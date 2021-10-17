<script>
/**
 * @see https://ethical-ad-client.readthedocs.io/en/latest/
 */
export default {
  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Only reload if the ad has been loaded
        // otherwise it's possible that the script is appended but
        // the ads are not loaded yet. This would result in duplicated ads.
        [...this.$el.classList].includes('loaded')
      ) {
        this.$el.innerHTML = ''
        this.$el.classList.remove('loaded')
        this.load()
      }
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const s = document.createElement('script')
      s.id = '_ads_js'
      s.src = `https://media.ethicalads.io/media/client/ethicalads.min.js`
      s.async = 'async'
      this.$el.appendChild(s)
    },
  },
  render(h) {
    return h('div', {
      attrs: {
        id: 'ads',
        'data-ea-publisher': 'vue-select',
        'data-ea-type': 'image',
      },
      class: 'flat horizontal',
    })
  },
}
</script>

<style scoped>
#ads {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 264px;
}
</style>
