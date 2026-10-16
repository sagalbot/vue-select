---
title: CSS & Theming
section: Templating & Styling
description: Theme Vue Select with CSS custom properties, override its classes, and change the dropdown transition.
---

Vue Select's styles are built on CSS custom properties (variables), so you can theme it from your
own stylesheet without a build step. For changes to markup rather than appearance, use
[slots](/guide/slots).

Remember to [include the stylesheet](/guide/install#css):

```js
import 'vue-select/style.css'
```

## CSS Variables

Every color, border, size and timing in the component reads from a `--vs-*` variable. Set the
variables on `:root` to change every select in your app, or on any element to change only the
selects inside it.

In this example the variables are set on a wrapper element to give one select its own theme:

::guide-css-variables
::

```vue
<template>
  <div class="purple-theme">
    <VueSelect :options="countries" placeholder="Choose a country" />
  </div>
</template>

<style scoped>
.purple-theme {
  padding: 1rem;
  border-radius: 0.5rem;
  background: #282c34;

  --vs-controls-color: #a78bfa;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;
  --vs-search-input-bg: #282c34;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
```

::callout{type="warning" title="Teleported dropdowns"}
With [`append-to`](/guide/positioning#teleporting-the-dropdown), the dropdown menu is moved
outside the component, so it doesn't inherit variables set on a wrapper element. Set the dropdown
variables on `:root` (or on the element you teleport to) instead.
::

The variables are declared on `:root` and `:host`, so they also work inside a shadow root.

### Available Variables

The [CSS variables reference](/api/css-variables) lists every variable with its default value and
what it styles. A few worth knowing:

- `--vs-controls-size` scales the clear and toggle icons (and the spinner): `1` is 20px.
- `--vs-dropdown-option--active-bg` is the highlighted option's background. The default has a
  4.6:1 contrast ratio with the white `--vs-dropdown-option--active-color`, which meets WCAG AA.
  If you change either, keep the contrast at 4.5:1 or higher.
- `--vs-search-input-bg` is the field's background, and `--vs-dropdown-bg` the dropdown's.
- `--vs-focus-color` and `--vs-focus-ring` style the [focus indicators](#focus-styles).
- `--vs-state-disabled-bg`, `--vs-state-disabled-color` and `--vs-state-disabled-controls-color`
  style a `disabled` select.

## Dark Mode

Vue Select follows the page's [`color-scheme`](https://developer.mozilla.org/docs/Web/CSS/color-scheme).
Under `color-scheme: dark` the field, dropdown, selected tags, icons, spinner and focus ring switch
to dark colors. Pages that never set `color-scheme` stay light, so nothing changes until you opt in.

::guide-dark-mode
::

The scheme comes from the nearest element that sets it, so you can set it on `<html>` for the whole
page or on a wrapper for one section:

```css
/* follow the operating system */
:root {
  color-scheme: light dark;
}

/* Tailwind, Nuxt color mode and other class-based dark modes */
.dark {
  color-scheme: dark;
}
```

To keep a select in one scheme on a page that switches, set `color-scheme` on the select itself
(and on the [`append-to`](/guide/positioning#teleporting-the-dropdown) target if you teleport the
dropdown):

```css
.v-select {
  color-scheme: light;
}
```

Option and search text use `inherit`, so they take the page's text color in either scheme. The
highlighted option (`#136cfb` with white text) and the deselect color look the same in both.

::callout{type="note" title="Teleported dropdowns"}
A dropdown moved with `append-to` takes the `color-scheme` of its new parent (for example `body`),
not of the field.
::

### Customizing Dark Colors

There are no separate dark variables. Each color variable holds both values in
[`light-dark()`](https://developer.mozilla.org/docs/Web/CSS/color_value/light-dark), so set a
`light-dark()` pair to change both schemes, or a single color to use it in both:

```css
:root {
  --vs-dropdown-bg: light-dark(#ffffff, #0f172a);
  --vs-search-input-bg: light-dark(#ffffff, #0f172a);
  --vs-selected-bg: light-dark(#f1f5f9, #1e293b);
}
```

The [CSS Variables reference](/api/css-variables) lists the dark value of each variable. Browsers
without `light-dark()` (before Chrome 123, Safari 17.5 and Firefox 120) always show the light colors.

## Overriding Default Styles

Vue Select uses selectors with a single class wherever possible, and its class names are prefixed
to avoid collisions with your app: `v-select` on the root element, `vs__*` for elements and
`vs--*` for states.

To override a default rule, add one level of specificity. Put `.v-select` in front of a `vs__*`
selector to change every select, or use your own class to change one:

::guide-css-specificity
::

```vue
<template>
  <VueSelect
    class="style-chooser"
    placeholder="Choose a styling option"
    :options="['Slots', 'CSS variables', 'Your own CSS']"
  />
</template>

<style>
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
</style>
```

Classes passed to `<VueSelect>` land on the root `.v-select` element. In a `<style scoped>`
block, wrap the inner selectors in `:deep()`, for example `.style-chooser :deep(.vs__dropdown-toggle)`.

### Class Reference

| Class                             | Element                                                        |
|-----------------------------------|----------------------------------------------------------------|
| `.v-select`                       | Root element                                                   |
| `.vs__dropdown-toggle`            | The field: selected values, search input and actions           |
| `.vs__selected-options`           | Wraps the selected values and the search input                 |
| `.vs__selected`                   | A selected value                                               |
| `.vs__deselect`                   | The deselect button on a selected value (multiple)             |
| `.vs__search`                     | The search input (a `div` when `searchable` is false)          |
| `.vs__actions`                    | Wraps the clear button, toggle button and spinner              |
| `.vs__clear`                      | The clear button                                               |
| `.vs__open-indicator-button`      | The toggle button                                              |
| `.vs__open-indicator`             | The icon inside the toggle button                              |
| `.vs__icon`                       | The built-in SVG icons                                         |
| `.vs__spinner`                    | The loading spinner                                            |
| `.vs__dropdown-menu`              | The dropdown list (`ul`)                                       |
| `.vs__dropdown-option`            | An option                                                      |
| `.vs__dropdown-group`             | An option group                                                |
| `.vs__dropdown-group-label`       | An option group's header                                       |
| `.vs__no-options`                 | The "no options" message                                       |

Options get modifier classes for their state: `--highlight` (the keyboard or mouse highlight),
`--selected`, `--disabled` (not [selectable](/guide/selectable)), and `--deselect` (highlighted
and will be deselected, with `deselectFromDropdown`).

The root element gets state classes: `vs--open`, `vs--single`, `vs--multiple`, `vs--searching`
(there is search text), `vs--searchable`, `vs--unsearchable`, `vs--loading` and `vs--disabled`.

### Focus Styles

While the search input has focus, the field (`.vs__dropdown-toggle`) shows a focus ring: its border
turns `--vs-focus-color` and it gets the `--vs-focus-ring` box shadow. The clear, deselect and toggle
buttons get a `--vs-focus-color` outline when they're focused from the keyboard (`:focus-visible`).

```css
:root {
  --vs-focus-color: #7c3aed;
  /* a wider ring */
  --vs-focus-ring: 0 0 0 3px rgb(124 58 237 / 0.35);
}
```

Set `--vs-focus-ring: none` to remove the ring around the field, for example when your app already
styles `:focus-within` on its form fields. Keep some visible focus indicator either way.

## Dropdown Transition

The dropdown fades in and out with a Vue `<Transition>` named `vs__fade`. To use your own
transition, pass its name with the `transition` prop and define the
[transition classes](https://vuejs.org/guide/built-ins/transition.html#transition-classes):

```vue
<VueSelect transition="slide" />
```

```css
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
```

To remove the transition entirely, set `transition=""`.
