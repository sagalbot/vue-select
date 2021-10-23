Vue Select offers many APIs for customizing the look and feel from the component. You can use
[scoped slots](../api/slots.md), [custom child components](components.md), or modify the built in
SCSS variables.

::: tip Support for CSS variables (custom properties) is currently on the road map for those that
are not using sass in their projects.
:::

## SCSS Variables

Variables are leveraged in as much of the component styles as possible. If you really want to dig
into the SCSS, the files are located in `src/scss`. The variables listed below can be found at
[`src/scss/global/_variables`](https://github.com/sagalbot/vue-select/blob/master/src/scss/global/_variables.scss)
.

All variables are implemented with `!default` in order to make them easier to override in your
application.

<<< @/../src/scss/global/_variables.scss

## Overriding Default Styles

Vue Select takes the approach of using selectors with a single level of specificity, while using
classes that are very specific to Vue Select to avoid collisions with your app.

All classes within Vue Select use the `vs__` prefix, and selectors are generally a single classname
– unless there is a state being applied to the component.

In order to override a default property in your app, you should add one level of specificity. The
easiest way to do this, is to add `.v-select` before the `vs__*` selector if you want to adjust all
instances of Vue Select, or add your own classname if you just want to affect one.

<CssSpecificity />  

<<< @/.vuepress/components/CssSpecificity.vue

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

## Option Wrapping Strategy

When options in the dropdown are wider than the dropdown itself, there are three strategies
available. The strategy can be set with the `dropdownOptionWrap` prop. This prop accepts one of
three strings:

### `wrap`

Break options that are wider than the dropdown onto the next line. No horizontal scrollbar.

```vue
<v-select dropdown-option-wrap="wrap" />
```

<OptionWrapStrategy wrap="wrap" />

### `truncate`

Truncate options that are wider than the dropdown using an ellipsis `...`. No horizontal scrollbar.

```vue
<v-select dropdown-option-wrap="truncate" />
```

<OptionWrapStrategy wrap="truncate" />

### `nowrap`

Don't wrap or truncate options wider than the dropdown. Introduces horizontal scrollbar.

```vue
<v-select dropdown-option-wrap="nowrap" />
```

<OptionWrapStrategy wrap="nowrap" />
