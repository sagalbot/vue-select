## Selectable Prop <Badge text="v3.3.0+" />

The `selectable` prop determines if an option is selectable or not. If `selectable` returns false
for a given option, it will be displayed with a `vs__dropdown-option--disabled` class. The option
will be disabled and unable to be selected. 

```js
selectable: {
  type: Function,
  /**
   * @param {Object|String} option
   * @return {boolean}
   */
  default: option => true,
},
```

### Example

Here `selectable` is used to prevent books by a certain author from being chosen. In this case,
the options passed to the component are objects: 

```json
{ 
    title: "Right Ho Jeeves", 
    author: { firstName: "P.D", lastName: "Woodhouse" }, 
}
```

This object will be passed to `selectable`, so we can check if the author should be selectable or not.

<UnselectableExample />

<<< @/.vuepress/components/UnselectableExample.vue{6}

## Limiting the Number of Selections

`selectable` can also be used a bit more creatively to limit the number selections that can be made 
within the component. In this case, the user can select any author, but may only select a maximum
of three books.

<LimitSelectionQuantity />

<<< @/.vuepress/components/LimitSelectionQuantity.vue{8}
