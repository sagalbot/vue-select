## On-Change Callback

vue-select provides an onChange property that accepts a callback function. This function is passed the currently selected value(s) as it's only parameter.

This is very useful when integrating with Vuex, as it will allow your to trigger an action to update your vuex state object. Choose a callback and see it in action.

```html
<v-select on-change="consoleCallback" :options="countries"></v-select>
```

```javascript
methods: {
  consoleCallback(val) {
    console.dir(JSON.stringify(val))
  },

  alertCallback(val) {
    alert(JSON.stringify(val))
  }
}
```