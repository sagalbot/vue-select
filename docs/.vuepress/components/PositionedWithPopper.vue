<template>
  <v-select :options="countries" append-to-body :calculate-position="withPopper" />
</template>

<script>
import countries from '../data/countries'
import { createPopper } from '@popperjs/core';

export default {
  data: () => ({countries}),
  methods: {
    withPopper (dropdownList, component, {width},) {
      dropdownList.style.width = width;
      createPopper(component.$refs.toggle, dropdownList, {
        modifiers: [
          {
            name: 'offset', options: {
              offset: [0, -1]
            }
          },
          {
            enabled: true,
            phase: 'write',
            fn ({state}) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            },
          }]
      });
    }
  }
};
</script>

<style>
  .v-select.drop-up .vs__dropdown-toggle {
    border-bottom-color: rgba(60, 60, 60, 0.26);
    border-top-color: transparent;
    border-radius: 0 0 4px 4px;
  }

  [data-popper-placement='top'] {
    border-radius: 4px 4px 0 0;
    border-top-style: solid;
    border-bottom-style: none;
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.15)
  }
</style>
