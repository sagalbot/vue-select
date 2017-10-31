## AJAX Remote Option Loading

The onSearch prop allows you to load options via ajax in a parent component when the search text is updated. It is invoked with two parameters, search & loading.

onSearch Callback Parameters search, loading

search is a string containing the current search text. loading is a function that accepts a boolean value, and is used to toggle the 'loading' class on the top-level vue-select wrapper.

Debounce Input

Vue Select also accepts a debounce prop that can be used to prevent onSearch from being called until input has completed.

Library Agnostic

Since Vue.js does not ship with ajax functionality as part of the core library, it's up to you to process the ajax requests in your parent component.

```html
<v-select
	:debounce="250"
	:on-search="getOptions"
	:options="options"
	placeholder="Search GitHub Repositories..."
	label="full_name"
>
</v-select>
```

```javascript
data() {
	return {
		options: null
	}
},
methods: {
  getOptions(search, loading) {
    loading(true)
    this.$http.get('https://api.github.com/search/repositories', {
       q: search
    }).then(resp => {
       this.options = resp.data.items
       loading(false)
    })
  }
}
```