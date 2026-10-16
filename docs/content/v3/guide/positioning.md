---
title: "Dropdown Position"
section: "v3 · Customizing"
version: v3
---

## Default

With the default CSS, Vue Select uses absolute positioning to render the dropdown menu. The root
`.v-select` container (the components `$el`) is used as the `relative` parent for the dropdown. The
dropdown will be displayed below the `$el` regardless of the available space.

This works for most cases, but you might run into issues placing into a modal or near the bottom of
the viewport. If you need more fine grain control, you can use calculated positioning.

## Calculated :badge{text="v3.7.0+"}

If you want more control over how the dropdown is rendered, or if you're running into z-index issues,
you may use the `appendToBody` boolean prop. When enabled, Vue Select will append the dropdown to
the document, outside of the `.v-select` container, and position it with Javascript.

When `appendToBody` is true, the positioning will be handled by the `calculatePosition` prop. This
function is responsible for setting top/left absolute positioning values for the dropdown. The
default implementation places the dropdown in the same position that it would normally appear.

## Popper.js Integration :badge{text="v3.7.0+"}

[Popper.js](https://popper.js.org/) is an awesome, 3kb utility for calculating positions of just
about any DOM element relative to another.

By using the `appendToBody` and `calculatePosition` props, we're able to integrate directly with
popper to calculate positioning for us.

Check out the [Popper Docs](https://popper.js.org/docs/v2/modifiers/) to see the full `modifiers`
API being used below.

```vue
<template>
  <div>
    <v-select
      :options="countries"
      append-to-body
      :calculate-position="withPopper"
    />

    <label for="position" style="display: block; margin: 1rem 0">
      <input
        id="position"
        v-model="placement"
        type="checkbox"
        true-value="top"
        false-value="bottom"
      />
      Position dropdown above
    </label>
  </div>
</template>

<script>
import countries from '../data/countries'
import { createPopper } from '@popperjs/core'

export default {
  data: () => ({ countries, placement: 'top' }),
  methods: {
    withPopper(dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1],
            },
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn({ state }) {
              component.$el.classList.toggle(
                'drop-up',
                state.placement === 'top'
              )
            },
          },
        ],
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },
  },
}
</script>

<style>
.v-select.drop-up.vs--open .vs__dropdown-toggle {
  border-radius: 0 0 4px 4px;
  border-top-color: transparent;
  border-bottom-color: rgba(60, 60, 60, 0.26);
}

[data-popper-placement='top'] {
  border-radius: 4px 4px 0 0;
  border-top-style: solid;
  border-bottom-style: none;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15);
}
</style>
```
