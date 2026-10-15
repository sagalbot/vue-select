---
title: Dropdown Position
section: Customizing
description: Teleport the dropdown out of clipping containers with appendTo, and position it yourself with calculatePosition.
---

## Default

With the default CSS, the dropdown menu is absolutely positioned inside the component. The root
`.v-select` element is its `relative` parent, and the menu is displayed directly below the field,
regardless of the space available.

This works in most layouts. It breaks down when an ancestor clips its content (`overflow: hidden`
or `auto`, as in many modals, cards and tables) or creates a stacking context that hides the menu
behind other content.

## Teleporting the Dropdown

The `append-to` prop moves the dropdown menu to another element with Vue's
[`<Teleport>`](https://vuejs.org/guide/built-ins/teleport.html), so no ancestor of the component
can clip it. It accepts a CSS selector or an element. Usually that's `body`:

```vue
<VueSelect :options="countries" append-to="body" />
```

Both selects below sit in a card with `overflow: hidden`. Open them to compare:

::guide-append-to
::

When the dropdown is teleported, Vue Select positions it with JavaScript each time it opens: the
default `calculatePosition` places it directly below the field, at the field's width, using page
coordinates. The menu keeps its `vs__dropdown-menu` class, so your styles still apply, but it's no
longer inside `.v-select`:

- Selectors like `.my-select .vs__dropdown-menu` no longer match the menu.
- [CSS variables](/guide/css#css-variables) set on a wrapper aren't inherited. Set them on `:root`
  or on the element you teleport to.
- The menu carries the component's `dir`, so [right-to-left](/guide/localization#right-to-left)
  selects stay right-to-left.
- The default position is in page coordinates. If you teleport into an element other than `body`,
  that element and its ancestors shouldn't be positioned (`position: relative` and so on), or the
  coordinates won't line up. Otherwise, provide your own `calculatePosition`.

::callout{type="note" title="Coming from Vue Select 3?"}
`append-to="body"` replaces the `appendToBody` prop. `calculatePosition` now receives the combobox
context as its second argument instead of the component instance.
::

## Calculating the Position

The default position is calculated once, when the dropdown opens. If the page can scroll or resize
while it's open, or you need the dropdown to flip above the field when there isn't room below,
provide your own `calculatePosition`. It's only used together with `appendTo`.

```ts
calculatePosition(
  menu: HTMLElement,
  ctx: ComboBoxContext,
  position: {
    width: string
    top: string
    left: string
    toggle: HTMLElement
  },
): void | (() => void)
```

- `menu` is the dropdown `<ul>`. Set its `top`, `left` and `width` styles.
- `ctx` is the combobox context, with the component's state.
- `position` holds what the default implementation would use: `width`, `top` and `left` as CSS
  pixel strings, and `toggle`, the field element (`.vs__dropdown-toggle`) to position against.
- If you return a function, it's called when the dropdown closes (or the component unmounts). Use
  it to remove listeners or destroy a positioning library instance.

This version flips the dropdown above the field when there isn't enough room below, and follows the
field while the page scrolls:

::guide-calculate-position
::

```vue
<script setup>
import VueSelect from 'vue-select'

function calculatePosition(menu, ctx, { width, toggle }) {
  function update() {
    const field = toggle.getBoundingClientRect()
    const spaceBelow = window.innerHeight - field.bottom
    const above = spaceBelow < menu.offsetHeight && field.top > spaceBelow

    menu.style.width = width
    menu.style.left = `${window.scrollX + field.left}px`
    menu.style.top = above
      ? `${window.scrollY + field.top - menu.offsetHeight + 1}px`
      : `${window.scrollY + field.bottom - 1}px`
    menu.classList.toggle('drop-up', above)
  }

  update()
  window.addEventListener('scroll', update, true)
  window.addEventListener('resize', update)

  // Called when the dropdown closes
  return () => {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }
}
</script>

<template>
  <VueSelect :options="countries" append-to="body" :calculate-position="calculatePosition" />
</template>

<style>
.vs__dropdown-menu.drop-up {
  border-top-style: solid;
  border-bottom-style: none;
  border-radius: var(--vs-border-radius) var(--vs-border-radius) 0 0;
  box-shadow: 0 -3px 6px 0 var(--vs-colors--darkest);
}
</style>
```

### With Floating UI

A positioning library handles more edge cases (viewport edges, nested scroll containers, virtual
keyboards). With [Floating UI](https://floating-ui.com/), `autoUpdate` keeps the menu in place and
returns its own cleanup function:

```js
import { autoUpdate, computePosition, flip, offset, size } from '@floating-ui/dom'

function calculatePosition(menu, ctx, { toggle }) {
  return autoUpdate(toggle, menu, async () => {
    const { x, y, placement } = await computePosition(toggle, menu, {
      placement: 'bottom-start',
      middleware: [
        offset(-1),
        flip(),
        size({
          apply({ rects }) {
            menu.style.width = `${rects.reference.width}px`
          },
        }),
      ],
    })
    Object.assign(menu.style, { left: `${x}px`, top: `${y}px` })
    menu.classList.toggle('drop-up', placement.startsWith('top'))
  })
}
```
