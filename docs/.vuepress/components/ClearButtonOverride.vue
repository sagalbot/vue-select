<template>
  <div>
    <v-select
        :options="['Canada', 'United States']"
        :components="{Deselect}"
    />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
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
