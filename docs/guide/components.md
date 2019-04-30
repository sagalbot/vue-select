### Prop: `components` `{Object}`
---

Vue Select utilizes child components throughout, and exposes an API to overwrite these components 
with your own, using the `components` `{Object}` prop. The object provided to the `components` prop 
will be merged with Vue Select's default components. 
                   
<<< @/src/components/childComponents.js{4-7}

You can override the value of any of these keys with your own components.

## Deselect <Badge text="v3.1.0+" />

You may wish to roll your own deselect button. `Deselect` is used within tags on 
`multiple` selects, and serves as the clear button for single selects. Maybe you just want to use
a simple `<button>Clear</button>` instead.

```html
<v-select :components="{Deselect}" />
``` 

```js
export default {
  data: () => ({
    Deselect: {
      render: createElement => createElement('span', '❌'),
    },
  }),
};
```

  <ClearButtonOverride />

The same approach applies for `multiple` selects:

<MultipleClearButtonOverride />

## OpenIndicator  <Badge text="v3.1.0+" />

The `OpenIndicator` component is the 'caret' used within the component that adjusts orientation
based on whether the dropdown is open or closed.

```html
<v-select :components="{OpenIndicator}" />
```
```js
export default {
  data: () => ({
    selected: ['Canada'],
    OpenIndicator: {
      render: createElement => createElement('span', {class: {'toggle': true}}),
    },
  }),
};
```

<OpenIndicatorOverride />

## Setting Globally at Registration

If you want to all instances of Vue Select to use your custom components throughout your app, while
only having to set the implementation once, you can do so when registering Vue Select as a component.

```js
import Vue from 'vue';
import vSelect from 'vue-select';

// Set the components prop default to return our fresh components 
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('span', '❌'),
  },
  OpenIndicator: {
    render: createElement => createElement('span', '🔽'),
  },
});

// Register the component
Vue.component(vSelect)
```

<CustomComponentRegistration />

