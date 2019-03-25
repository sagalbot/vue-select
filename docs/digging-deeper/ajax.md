# AJAX Remote Option Loading

<CodePen url="POMeOX" height="400"/>

The `onSearch` prop allows you to load options via ajax in a parent component 
when the search text is updated. It is invoked with two parameters, `search` & `loading`.

```js
/**
* Accepts a callback function that will be run
* when the search text changes. The callback
* will be invoked with these parameters:
*
* @param {search}  String		Current search text
* @param {loading} Function	Toggle loading class
*/
onSearch: {
  type: Function,
  default: false
},
```

The `loading` function accepts a boolean parameter that will be assigned 
to the vue-select internal `loading` property. Call `loading(true)` to set the 
`loading` property to `true` - toggling the loading spinner. After your 
asynchronous operation completes, call `loading(false)` to toggle it off.  

#### Disabling Filtering

When loading server side options, it can be useful to disable the 
client side filtering. Use the `filterable` prop to disable filtering.

```js
/**
 * When true, existing options will be filtered
 * by the search text. Should not be used in
 * conjunction with taggable.
 * 
 * @type {Boolean}
 */
filterable: {
	type: Boolean,
	default: true
},
```

#### Loading Spinner

Vue Select includes a default loading spinner that appears when the loading class is present. The `spinner` slot allows you to implement your own spinner.

```html
<div class="spinner" v-show="spinner">Loading...</div>
```

#### Library Agnostic

Since Vue.js does not ship with ajax functionality as part of the core library, it's up to you to process the ajax requests in your parent component.

I recommend using [axios](https://github.com/axios/axios) for creating your applications HTTP layer, 
or [`fetch()`](https://github.com/github/fetch) for simple requests.
