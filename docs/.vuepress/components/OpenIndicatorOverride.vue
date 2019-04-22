<template>
  <div>
    <v-select
        multiple
        v-model="selected"
        :options="['Canada', 'United States']"
        :components="{OpenIndicator}"
    />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data: () => ({
    selected: ['Canada']
  }),
  computed: {
    OpenIndicator () {
      return Vue.component('OpenIndicator', {
        render (createElement) {
          return createElement('i', '🤘🏻');
        },
      });
    },
  },
};
</script>
