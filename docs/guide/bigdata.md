# Working with Big Datasets

When your `options` array gets into the thousands, you will start to see performance dip. If you 
have 2,000 options, you have 2,000 dom nodes being rendered into the dropdown. It's very difficult
to render that many nodes at once and maintain 60fps in the browser. 

Regardless of whether your options are primitives or objects, the performance hit comes from 
rendering their text labels (or slot) to the dom. The path to keeping things snappy is then to limit
the amount of nodes that get rendered to the dropdown. 

## Optimized Filtering

You can optimize performance by tweaking Vue Select's filtering and implementing it yourself. 
Consider a list of airport codes with roughly ~7,500 entries. Rendering out 7,500 airports doesn't 
actually help the user much, they're just looking for one in particular.

<AirportCodes />

The only difference between these two examples is the `filter` prop. Here's the `filter` for the
optimized example:

```js
filter (airports, search) {
  if (search.length === 0) {
    return airports.slice(0, 50);
  }
  return airports.filter(airport => {
    const keys = ['name', 'city', 'country', 'iata', 'icao'];
    return keys.some(key => String(airport[key]).toLowerCase().includes(search.toLowerCase()))
  }).slice(0, 50);
}
```  

If there's no search text, we only display the first 50 options. If there is a search query, we'll
check if any keys on the object include the search string. Again, we'll limit this to 50 options. 

The key to have Vue Select perform well with thousands of options is to limit the number of options
that are displayed to the end user, without hindering their ability to select the right option.
