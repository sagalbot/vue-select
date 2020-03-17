Vue Select doesn't ship with first party support for infinite scroll, but it's possible to implement
by hooking into the `open`, `close`, and `search` events, along with the `filterable` prop, and the
`list-footer` slot.

Let's break down the example below, starting with the `data`.

- `observer` - a new `IntersectionObserver` with `infiniteScroll` set as the callback
- `limit` - the number of options to display
- `search` - since we've disabled Vue Selects filtering, we'll need to filter options ourselves

When Vue Select opens, the `open` event is emitted and `onOpen` will be called. We wait for
`$nextTick()` so that the `$ref` we need will exist, then begin observing it for intersection.

The observer is set to call `infiniteScroll` when the `<li>` is completely visible within the list.
Some fancy destructuring is done here to get the first `ObservedEntry`, and specifically the
`isIntersecting` & `target` properties. If the `<li>` is intersecting, we increase the `limit`, and
ensure that the scroll position remains where it was before the list size changed. Again, it's
important to wait for `$nextTick` here so that the DOM elements have been inserted before setting
the scroll position.

<InfiniteScroll />

<<< @/.vuepress/components/InfiniteScroll.vue
