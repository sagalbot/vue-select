Vue Select offers many APIs for customizing the look and feel from the component. You can use
[scoped slots](../api/slots.md), [custom child components](components.md), or modify the built in
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

<CssVariables style="margin-top: 1rem;" />

<<< @/.vuepress/components/CssVariables.vue

### Available CSS Variables <Badge type="primary">3.18+</Badge>

<<< @/../src/css/global/variables.css

## SCSS <Badge type="warning">Deprecated in v3.18</Badge>

::: warning Deprecation Notice 
The SCSS build been deprecated for the `v3.x` release, and will be
removed in `v4.0.0`. The files will remain in the v3 codebase if you really need them, but the
recommended approach is to leverage the included CSS variables instead.
:::

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

Most classes within Vue Select use the `vs__` prefix, and selectors are generally a single classname
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
