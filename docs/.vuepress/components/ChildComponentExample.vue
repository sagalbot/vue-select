<template>
  <div>
    <v-select
        :options="['Canada', 'United States']"
        :components="defaults => ({...defaults, Deselect})"
    />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'ChildComponentExample',
  computed: {
    Deselect () {
      return Vue.component('Deselect', {
        render (createElement) {
          return createElement('button', 'Clear');
        },
      });
    },
  },
};
</script>
