<template>
  <v-select
          taggable
          multiple
          no-drop
          :map-keydown="handlers"
          placeholder="enter an email"
  />
</template>

<script>
export default {
  name: 'CustomHandlers',
  methods: {
    handlers: (map, vm) => ({
      ...map, 50: e => {
        e.preventDefault();
        if( e.key === '@' && vm.search.length > 0 ) {
          vm.search = `${vm.search}@gmail.com`;
        }
      },
    }),
  },
};
</script>
