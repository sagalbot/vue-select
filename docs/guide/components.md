Vue Select utilizes child components throughout, and an API to overwrite these components with your
own, using the `components` prop. When implementing the `components` prop in your code, Vue Select 
will call the function with a single parameter: an object containing all of the child components.
                   
- `OpenIndicator`
- `Deselect`

You can override the value of any of these keys with your own components. Just be sure that the 
object you return contains all the necessary keys.

## Deselect

You may wish to roll your own deselect button. `Deselect` is used within tags on 
`multiple` selects, and serves as the clear button for single selects. Maybe you just want to use
a simple `<button>Clear</button>` instead.

```html
<v-select :components="defaults => ({...defaults, Deselect})" />
``` 

```js
computed: {
  Deselect() {
    return Vue.component('Deselect', {
      render (createElement) {
        return createElement('button', 'Clear')
      }
    })
  }
}
```

<ClearButtonOverride />

The same approach applies for `multiple` selects:

<MultipleClearButtonOverride />

## OpenIndicator

The `OpenIndicator` component is the 'caret' used within the component that adjusts orientation
based on whether the dropdown is open or closed.

```html
<v-select :components="defaults => ({...defaults, OpenIndicator})" />
```
```js
computed: {
  OpenIndicator () {
    return Vue.component('OpenIndicator', {
      render (createElement) {
        return createElement('button', '🤘🏻');
      },
    });
  },
},
```

<OpenIndicatorOverride />
