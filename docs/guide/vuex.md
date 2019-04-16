### Using the `input` Event with Vuex

`vue-select` emits the `input` event any time the internal `value` is changed. 
This is the same event that allow the for the `v-model` syntax. When using
Vuex for state management, you can use the `input` event to dispatch an
action, or trigger a mutation.

```html
<v-select 
    @input="myAction" 
    :options="$store.state.options"
    :value="$store.state.selected"
  ></v-select>
``` 

<CodePen url="aJQJyp" height="350"/>
