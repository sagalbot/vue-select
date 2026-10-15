---
title: AJAX
section: Use Cases
description: Load options from a server as the user types, with a loading indicator and server-side filtering.
---

## Loading Options as the User Types

The `search` event fires whenever the search text changes. Use it to fetch matching options from
your server and pass them to the `options` prop. The event receives two arguments:

- `search` (`string`): the current search text.
- `loading` (`(value?: boolean) => void`): turns the loading state on or off. Call `loading(true)`
  before your request and `loading(false)` when it completes. Without an argument, it toggles.

Because the server does the matching, turn off Vue Select's own filtering with
`:filterable="false"`. Otherwise options that don't contain the search text in their label would
be hidden, even if your server considers them a match.

::guide-ajax
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = ref([])
const country = ref(null)
let timer
let latest = 0

function onSearch(search, loading) {
  clearTimeout(timer)
  if (!search) {
    latest++ // discard a request that's still in flight
    loading(false)
    return
  }
  loading(true)
  // Wait until the user pauses typing
  timer = setTimeout(async () => {
    const request = ++latest
    const response = await fetch(`/api/countries?q=${encodeURIComponent(search)}`)
    const results = await response.json()
    // Ignore responses that arrive after a newer request
    if (request !== latest) return
    options.value = results
    loading(false)
  }, 300)
}
</script>

<template>
  <VueSelect
    v-model="country"
    :options="options"
    :filterable="false"
    :reduce="(option) => option.value"
    @search="onSearch"
  >
    <template #no-options="{ search }">
      {{ search ? `No countries match "${search}".` : 'Start typing to search.' }}
    </template>
  </VueSelect>
</template>
```

The demo stands in for a server with a 500ms delay. A few details make it behave well:

- **Debouncing**: requests are only sent once the user pauses typing.
- **Out-of-order responses**: a slow response for an old search is ignored, so it can't replace
  the results of a newer one.
- **Empty searches**: `search` also fires with an empty string, for example when selecting an option
  clears the search text. The handler cancels any pending request and turns loading off.
- **Remembered selections**: when the options change after a search, the selected country keeps its
  label, even though `reduce` stores only its code. Vue Select remembers the options the user
  selects.

If you set a saved value when the page loads (an id from your database, for example), include its
option in `options`, so Vue Select can display its label. See
[Caveats with reduce](/guide/values#caveats-with-reduce).

Use whichever HTTP client you like; Vue Select only needs the resulting array.

## The Loading State

Besides the `loading` callback, you can control the loading state with the `loading` prop, for
example when your data layer already tracks whether a request is pending:

```vue
<VueSelect :options="results" :loading="isFetching" :filterable="false" @search="query = $event" />
```

While loading:

- the root element has the `vs--loading` class,
- the spinner is shown in place of the toggle icon,
- the dropdown stays closed. It opens again when loading finishes, if the user is still in the
  field.

## Loading Spinner

The default spinner is a CSS animation. Replace it with the `spinner` slot, which receives
`loading`:

```vue
<VueSelect :loading="isFetching">
  <template #spinner="{ loading }">
    <MySpinner v-if="loading" />
  </template>
</VueSelect>
```

Keep some text in your spinner (even visually hidden) so the loading state isn't only visual.
