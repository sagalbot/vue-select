<template>
  <div>
    <v-select
        multiple
        v-model="selected"
        :options="['Canada', 'United States']"
        :components="{Deselect}"
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
