Vue Select provides two props accepting `functions` that can be used to implement custom filtering
algorithms.

- `filter` <Badge text="v2.5.0+" />
- `filterBy` <Badge text="v2.5.0+" />

By default, the component will perform a very basic check to see if an options label includes
the current search text. If you're using scoped slots, you might have information within the
option templates that should be searchable. Or maybe you just want a better search algorithm that
can do fuzzy search matching.

## Filtering with Fuse.js

You can use the `filter` and `filterBy` props to hook right into something like
[Fuse.js](https://fusejs.io/) that can handle searching multiple object keys with fuzzy matchings.

<FuseFilter />

<<< @/.vuepress/components/FuseFilter.vue
