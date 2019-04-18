<script>
export default {
  render (h) {
    return h('div', {attrs: {id: 'codefund'}});
  },
  mounted () {
    this.load();
  },
  watch: {
    '$route' (to, from) {
      if (
        to.path !== from.path
        // Only reload if the ad has been loaded
        // otherwise it's possible that the script is appended but
        // the ads are not loaded yet. This would result in duplicated ads.
        && this.$el.querySelector('#cf')
      ) {
        this.$el.innerHTML = '';
        this.load();
      }
    },
  },
  methods: {
    load () {

      // const template = 'default';
      // const template = 'vertical';
      // const template = 'float-with-close';
      // const template = 'image-only';
      // const template = 'image-centered';
      // const template = 'square';
      const template = 'centered';
      // const template = 'bottom-bar';

      const s = document.createElement('script');
      s.id = '_codefund_js';
      s.src = `//codefund.app/properties/193/funder.js?template=${template}`;
      s.async = 'async';
      this.$el.appendChild(s);
    },
  },
};
</script>
