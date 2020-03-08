## Default

With the default CSS, Vue Select uses absolute positioning to render the dropdown menu. The root
`.v-select` container (the components `$el`) is used as the `relative` parent for the dropdown. The
dropdown will be displayed below the `$el` regardless of the available space. This works for most
cases, but you might run into issues placing into a modal or near the bottom of the viewport.

## Calculated

If you want more control over how the dropdown is rendered, or if you're running into z-index issues,
you may use the `appendToBody` boolean prop. When enabled, Vue Select will append the dropdown to
the document, outside of the `.v-select` container, and position it with Javscript.

When `appendToBody` is true, the positioning will be handled by the `calculatePosition` prop. This
function is responsible for setting top/left absolute positioning values for the dropdown. The
default implementation places the dropdown in the same position that it would normally appear.

## Popper.js Integration

By using the `appendToBody` and `calculatePosition` props, we're able to integrate directly with
Popper.js to handle positioning for us.

<PositionedWithPopper />

<<< @/.vuepress/components/PositionedWithPopper.vue
