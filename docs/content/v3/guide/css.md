---
title: "CSS & Selectors"
section: "v3 · Templating & Styling"
version: v3
---

Vue Select offers many APIs for customizing the look and feel from the component. You can use
[scoped slots](/v3/api/slots), [custom child components](/v3/guide/components), or modify the built in
CSS properties.

## CSS Variables

Vue Select uses custom CSS properties throughout the component to handle visual opinions. This
allows for quite a bit of flexibility in styling, without having to hook into a build system for
generating your own styles with something like SASS. If there is a value that you think should use a
CSS property instead of a hardcoded CSS value, please submit a PR.

## Dark Mode Example

Without writing any CSS yourself, you can completely customize the look and feel of Vue Select
through the use of CSS variables. In this example, we adjust the colors of the component to match
for a dark mode application.

In this case, the variables are scoped to only this implementation of the component, but you could
place these variables anywhere in your applications CSS file to implement at a global level for your
app.

Check the MDN docs for more info
about [CSS Custom Properties.](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

```vue
<template>
  <div style="background: #282c34; padding: 1rem; border-radius: 0.3rem">
    <v-select :options="countries" />
  </div>
</template>

<script>
import countries from '../data/countries.js'
export default {
  data: () => ({ countries }),
}
</script>

<style scoped>
>>> {
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
```

### Available CSS Variables :badge{text="3.18+" type="primary"}

```css
:root,
:host {
    --vs-colors--lightest: rgba(60, 60, 60, 0.26);
    --vs-colors--light: rgba(60, 60, 60, 0.5);
    --vs-colors--dark: #333;
    --vs-colors--darkest: rgba(0, 0, 0, 0.15);

    /* Search Input */
    --vs-search-input-color: inherit;
    --vs-search-input-bg: rgb(255, 255, 255);
    --vs-search-input-placeholder-color: inherit;

    /* Font */
    --vs-font-size: 1rem;
    --vs-line-height: 1.4;

    /* Disabled State */
    --vs-state-disabled-bg: rgb(248, 248, 248);
    --vs-state-disabled-color: var(--vs-colors--light);
    --vs-state-disabled-controls-color: var(--vs-colors--light);
    --vs-state-disabled-cursor: not-allowed;

    /* Borders */
    --vs-border-color: var(--vs-colors--lightest);
    --vs-border-width: 1px;
    --vs-border-style: solid;
    --vs-border-radius: 4px;

    /* Actions: house the component controls */
    --vs-actions-padding: 4px 6px 0 3px;

    /* Component Controls: Clear, Open Indicator */
    --vs-controls-color: var(--vs-colors--light);
    --vs-controls-size: 1;
    --vs-controls--deselect-text-shadow: 0 1px 0 #fff;

    /* Selected */
    --vs-selected-bg: #f0f0f0;
    --vs-selected-color: var(--vs-colors--dark);
    --vs-selected-border-color: var(--vs-border-color);
    --vs-selected-border-style: var(--vs-border-style);
    --vs-selected-border-width: var(--vs-border-width);

    /* Dropdown */
    --vs-dropdown-bg: #fff;
    --vs-dropdown-color: inherit;
    --vs-dropdown-z-index: 1000;
    --vs-dropdown-min-width: 160px;
    --vs-dropdown-max-height: 350px;
    --vs-dropdown-box-shadow: 0px 3px 6px 0px var(--vs-colors--darkest);

    /* Options */
    --vs-dropdown-option-bg: #000;
    --vs-dropdown-option-color: var(--vs-dropdown-color);
    --vs-dropdown-option-padding: 3px 20px;

    /* Active State */
    --vs-dropdown-option--active-bg: #5897fb;
    --vs-dropdown-option--active-color: #fff;

    /* Deselect State */
    --vs-dropdown-option--deselect-bg: #fb5858;
    --vs-dropdown-option--deselect-color: #fff;

    /* Transitions */
    --vs-transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
    --vs-transition-duration: 150ms;
}
```

## SCSS :badge{text="Deprecated in v3.18" type="warning"}

::callout{type="warning" title="Deprecation Notice"}
The SCSS build been deprecated for the `v3.x` release, and will be
removed in `v4.0.0`. The files will remain in the v3 codebase if you really need them, but the
recommended approach is to leverage the included CSS variables instead.
::

Variables are leveraged in as much of the component styles as possible. If you really want to dig
into the SCSS, the files are located in `src/scss`. The variables listed below can be found at
[`src/scss/global/_variables`](https://github.com/sagalbot/vue-select/blob/master/src/scss/global/_variables.scss)
.

All variables are implemented with `!default` in order to make them easier to override in your
application.

```scss
$vs-colors: (
    lightest: rgba(60, 60, 60, 0.26),
    light: rgba(60, 60, 60, 0.5),
    dark: #333,
    darkest: rgba(0, 0, 0, 0.15),
) !default;

//  Global Component Variables
$vs-component-bg: none !default;
$vs-component-line-height: 1.4 !default;
$vs-component-placeholder-color: inherit !default;

//  Active State
$vs-state-active-bg: #5897fb !default;
$vs-state-active-color: #fff !default;

//  Deselect State
$vs-state-deselect-bg: #fb5858 !default;
$vs-state-deselect-color: #fff !default;

//  Disabled State
$vs-state-disabled-bg: rgb(248, 248, 248) !default;
$vs-state-disabled-color: map_get($vs-colors, 'light') !default;
$vs-state-disabled-controls-color: map_get($vs-colors, 'light') !default;
$vs-state-disabled-cursor: not-allowed !default;

//  Borders
$vs-border-width: 1px !default;
$vs-border-style: solid !default;
$vs-border-radius: 4px !default;
$vs-border-color: map_get($vs-colors, 'lightest') !default;

//  Component Controls: Clear, Open Indicator
$vs-controls-color: map_get($vs-colors, 'light') !default;
$vs-controls-size: 1 !default;
$vs-controls-deselect-text-shadow: 0 1px 0 #fff !default;

//  Selected
$vs-selected-bg: #f0f0f0 !default;
$vs-selected-border-color: $vs-border-color !default;
$vs-selected-border-style: $vs-border-style !default;
$vs-selected-border-width: $vs-border-width !default;

//  Dropdown
$vs-dropdown-z-index: 1000 !default;
$vs-dropdown-min-width: 160px !default;
$vs-dropdown-max-height: 350px !default;
$vs-dropdown-box-shadow: 0px 3px 6px 0px map_get($vs-colors, 'darkest') !default;
$vs-dropdown-bg: #fff !default;
```

## Overriding Default Styles

Vue Select takes the approach of using selectors with a single level of specificity, while using
classes that are very specific to Vue Select to avoid collisions with your app.

Most classes within Vue Select use the `vs__` prefix, and selectors are generally a single classname
– unless there is a state being applied to the component.

In order to override a default property in your app, you should add one level of specificity. The
easiest way to do this, is to add `.v-select` before the `vs__*` selector if you want to adjust all
instances of Vue Select, or add your own classname if you just want to affect one.

```vue
<template>
  <div>
    <v-select
      class="style-chooser"
      placeholder="Choose a Styling Option"
      :options="['Components', 'CSS / Variables', 'Slots']"
    />
  </div>
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

## Dropdown Transition

By default, the dropdown transitions with a `.15s` cubic-bezier opacity fade in/out. The component
uses the [VueJS transition system](https://vuejs.org/v2/guide/transitions.html). By default, the
transition name is `vs__fade`. There's a couple ways to override or change this transition.

1. Use the `transition` prop. Applying this prop will change the name of the animation classes and
   negate the default CSS. If you want to remove it entirely, you can set it to an empty string.

```html

<v-select transition="" />
```

2. You can also override the default CSS for the `vs__fade` transition. Again, if you wanted to
   eliminate the transition entirely:

```css
.vs__fade-enter-active,
.vs__fade-leave-active {
    transition: none;
}
```
