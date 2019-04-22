Vue Select offers many APIs for customizing the look and feel from the component. You can use 
[scoped slots](../api/slots.md), [custom child components](components.md), or modify the built in 
SCSS variables. 

::: tip
Support for CSS variables (custom properties) is currently on the road map for those
that are not using sass in their projects. 
::: 

## SCSS Variables

Variables are leveraged in as much of the component styles as possible. If you really want to dig
into the SCSS, the files are located in `src/scss`. The variables listed below can be found at
[`src/scss/global/_variables`](https://github.com/sagalbot/vue-select/blob/master/src/scss/global/_variables.scss).

All variables are implemented with `!default` in order to make them easier to override in your
application.

<<< @/src/scss/global/_variables.scss

## Overriding Default Styles

Vue Select takes the approach of using selectors with a single level of specificity, while using
classes that are very specific to Vue Select to avoid collisions with your app.

All classes within Vue Select use the `vs__` prefix, and selectors are generally a single classname 
– unless there is a state being applied to the component.

In order to override a default property in your app, you should add one level of specificity. 
The easiest way to do this, is to add `.v-select` before the `vs__*` selector if you want to adjust
all instances of Vue Select, or add your own classname if you just want to affect one.

<CssSpecificity />  

<<< @/docs/.vuepress/components/CssSpecificity.vue


