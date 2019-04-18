## Loading Options with AJAX

The `search` event provides a hook to load options from a parent component 
when the search text is updated. It is emitted with two parameters:
 
**Search Event Parameters**
- `search {String}`     The current search string
- `loading {Function}`  Accepts a boolean parameter to toggle the loading state

```html
<v-select @search="fetchOptions" />
```

```js
/**
 * Triggered when the search text changes.
 *
 * @param search  {String}    Current search text
 * @param loading {Function}	Toggle loading class
 */
fetchOptions (search, loading) {
  //  ... do some asynchronous stuff!  
},
```

The `loading` function accepts a boolean parameter that will be assigned 
to the vue-select internal `loading` property. Call `loading(true)` to set the 
`loading` property to `true` - toggling the loading spinner. After your 
asynchronous operation completes, call `loading(false)` to toggle it off.  

## Disabling Filtering

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

## Loading Spinner

Vue Select includes a default loading spinner that appears when the loading class is present. The 
`spinner` slot allows you to implement your own spinner.

```html
<div class="spinner" v-show="spinner">Loading...</div>
```

## Library Agnostic

Since Vue.js does not ship with ajax functionality as part of the core library, it's up to you to 
process the ajax requests in your parent component.

I recommend using [axios](https://github.com/axios/axios) for creating your applications HTTP layer, 
or [`fetch()`](https://github.com/github/fetch) for simple requests.

## Example

The [codepen example](https://codepen.io/sagalbot/pen/POMeOX) wraps up all the above concepts and
searches GitHub repositories. It also uses scoped slots to add some custom templating. 

<CodePen url="POMeOX" height="400"/>
