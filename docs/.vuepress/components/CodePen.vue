<template>
  <p :data-height="height"
     data-theme-id="32252"
     :data-slug-hash="url"
     data-default-tab="result"
     data-user="sagalbot"
     class="codepen">
  </p>
</template>

<script>
import mountCodePen from '../utils/codePen';

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    height: {
      default: 250
    }
  },
  mounted () {
    mountCodePen();
  },
};
</script>
