---
title: "Child Components"
section: "v3 · Templating & Styling"
version: v3
---

### Prop: `components` `{Object}`
---

Vue Select utilizes child components throughout, and exposes an API to overwrite these components 
with your own, using the `components` `{Object}` prop. The object provided to the `components` prop 
will be merged with Vue Select's default components. 
                   
```js
import Deselect from './Deselect.vue'
import OpenIndicator from './OpenIndicator.vue'

export default {
  Deselect,
  OpenIndicator,
}
```

You can override the value of any of these keys with your own components.

## Deselect :badge{text="v3.1.0+"}

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

  ```vue
  <template>
    <div>
      <v-select
        v-model="selected"
        placeholder="choose a country"
        :components="{ Deselect }"
        :options="['Canada', 'United States']"
      />
    </div>
  </template>

  <script>
  export default {
    data: () => ({
      selected: 'Canada',
      Deselect: {
        render: (createElement) => createElement('span', '❌'),
      },
    }),
  }
  </script>
  ```

The same approach applies for `multiple` selects:

```vue
<template>
  <div>
    <v-select
      v-model="selected"
      multiple
      :options="['Canada', 'United States']"
      :components="{ Deselect }"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: ['Canada'],
    Deselect: {
      render: (createElement) => createElement('span', '❌'),
    },
  }),
}
</script>
```

## OpenIndicator  :badge{text="v3.1.0+"}

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

```vue
<template>
  <div>
    <v-select
      :options="['Canada', 'United States']"
      :components="{ OpenIndicator }"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    OpenIndicator: {
      render: (createElement) => createElement('span', '🔽'),
    },
  }),
}
</script>
```

## Setting Globally at Registration

If you want all instances of Vue Select to use your custom components throughout your app, while
only having to set the implementation once, you can do so when registering Vue Select as a component.

## Vue 2x
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

## Vue 3x
```js
import {createApp, h} from 'vue';
import vSelect from 'vue-select';

// Set the components prop default to return our fresh components 
vSelect.props.components.default = () => ({
  Deselect: {
    render: () => h('span', '❌'),
  },
  OpenIndicator: {
    render: () => h('span', '🔽'),
  },
});

// Register the component
const app = createApp(App);
app.component('vSelect', vSelect);
```

```vue
<template>
  <v-select
    :options="['Vue.js', 'React', 'Angular']"
    :components="{ Deselect, OpenIndicator }"
  />
</template>

<script>
export default {
  data: () => ({
    Deselect: {
      render: (createElement) => createElement('span', '❌'),
    },
    OpenIndicator: {
      render: (createElement) => createElement('span', '🔽'),
    },
  }),
}
</script>
```
