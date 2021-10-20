## Default

With the default CSS, Vue Select uses absolute positioning to render the dropdown menu. The root
`.v-select` container (the components `$el`) is used as the `relative` parent for the dropdown. The
dropdown will be displayed below the `$el` regardless of the available space.

This works for most cases, but you might run into issues placing into a modal or near the bottom of
the viewport. If you need more fine grain control, you can use calculated positioning.

## Calculated <Badge text="v3.7.0+" />

If you want more control over how the dropdown is rendered, or if you're running into z-index
issues, you may use the `appendTo` prop. `appendTo` accepts a string that will be used as a
selector, or may pass an `HTMLElement` directly. When provided with a selector or element, Vue
Select will append the dropdown to the element, outside of the `.v-select` container, and position
it with Javascript instead of CSS.

When `appendTo` has been set, the positioning will be handled by the `calculatePosition` prop. This
function is responsible for setting top/left absolute positioning values for the dropdown. The
default implementation places the dropdown in the same position that it would normally appear.

<AppendToBody />

<<< @/.vuepress/components/AppendToBody.vue{25-59}

## Popper.js Integration <Badge text="v3.7.0+" />

[Popper.js](https://popper.js.org/) is an awesome, 3kb utility for calculating positions of just
about any DOM element relative to another.

By using the `appendTo` and `calculatePosition` props, we're able to integrate directly with
popper to calculate positioning for us.

<PositionedWithPopper />

Check out the [Popper Docs](https://popper.js.org/docs/v2/modifiers/) to see the full `modifiers`
API being used below.

<<< @/.vuepress/components/PositionedWithPopper.vue{25-59}
