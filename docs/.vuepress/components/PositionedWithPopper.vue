<template>
  <v-select :options="countries" append-to-body :calculate-position="withPopper" />
</template>

<script>
import countries from '../data/countries'
import { createPopper } from '@popperjs/core';

export default {
  data: () => ({ countries }),
  methods: {
    withPopper (el, vnode) {
      createPopper(vnode.context.$refs.toggle, el, {
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
              if (state.placement === 'top') {
                vnode.context.$el.classList.add('drop-up')
              } else {
                vnode.context.$el.classList.remove('drop-up')
              }
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
    border-bottom-style: solid;
    border-radius: 0 0 4px 4px;
  }

  [data-popper-placement='top'] {
    border-radius: 4px 4px 0 0;
    border-top-style: solid;
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.15)
  }
</style>
