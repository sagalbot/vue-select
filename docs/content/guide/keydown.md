---
title: Keydown Events
section: Customizing
description: Change or extend Vue Select's keyboard handling with mapKeydown.
---

Vue Select handles keyboard input on the search input following the WAI-ARIA combobox pattern
(see the [key reference](/guide/accessibility#keyboard)). The `mapKeydown` prop lets you change
what any key does, or add handlers for keys Vue Select doesn't use.

## `mapKeydown`

`mapKeydown` is a function that receives the default handlers and returns the handlers to use:

```ts
(handlers: KeydownHandlers, ctx: ComboBoxContext) => KeydownHandlers
```

- `handlers` maps [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)
  values (`'Enter'`, `'ArrowDown'`, `','`) to functions that receive the `KeyboardEvent`.
- `ctx` is the combobox context: the component's state and methods, such as `ctx.search`,
  `ctx.open`, `ctx.setSearch()` and `ctx.typeAheadSelect()`. State values are refs, so read them
  with `.value`. The [headless guide](/guide/headless) documents the full context.

When a key has a handler, it runs instead of Vue Select's default. Keys without a handler keep
their browser behavior, like typing a character. Handlers don't run while an
[IME composition](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event)
is in progress.

Spread the default handlers into your result to keep them, and reuse them by name. For example,
`map.Enter` is "select the highlighted option".

::callout{type="note" title="Coming from Vue Select 3?"}
Handlers used to be keyed by `keyCode` (`13`, `9`, `188`) and received the component instance.
Use key names instead (`'Enter'`, `'Tab'`, `','`) and read state from `ctx`. `selectOnKeyCodes`
and `selectOnTab` have been removed; the examples below replace them.
::

### Default Handlers

For the default, editable select:

| Key           | Default handler                                                        |
|---------------|------------------------------------------------------------------------|
| `ArrowDown`   | Open the dropdown, or highlight the next option                        |
| `ArrowUp`     | Open the dropdown, or highlight the previous option                    |
| `Enter`       | Select the highlighted option, or close if none is highlighted. While the dropdown is closed, create a tag (with `taggable` and search text); otherwise leave the key to the browser, so it can submit a form |
| `Escape`      | Close the dropdown, or clear the search text if it's already closed     |
| `Backspace`   | With an empty search, remove the last selected value                   |
| `' '` (Space) | With an empty search, open a closed dropdown instead of typing a space  |

With `:searchable="false"`, the map holds the
[select-only handlers](/guide/accessibility#select-only) instead: `ArrowDown`, `ArrowUp`, `Home`,
`End`, `PageUp`, `PageDown`, `Enter`, `' '`, `Tab` and `Escape`.

## Selecting with Other Keys

### Comma

To create a tag when the user types a comma, map `','` to the `Enter` handler. When it selects or
creates an option, the `Enter` handler calls `preventDefault()`, so the comma isn't typed into the
input. This also works in a [tag input without a dropdown](/guide/tagging#tag-inputs-without-a-dropdown).

::guide-keydown-comma
::

```vue
<VueSelect
  v-model="tags"
  taggable
  multiple
  :map-keydown="(map) => ({ ...map, ',': map.Enter })"
/>
```

### Tab

To select the highlighted option when the user tabs away, add a `Tab` handler. It doesn't call
`preventDefault()`, so focus still moves to the next field. (Mapping `Tab` to `map.Enter` would
select the option but keep focus in the select.)

::guide-keydown-tab
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const country = ref(null)

const selectOnTab = (map, ctx) => ({
  ...map,
  Tab: () => ctx.open.value && ctx.typeAheadSelect(),
})
</script>

<template>
  <VueSelect v-model="country" :options="countries" :map-keydown="selectOnTab" />
</template>
```

## Removing a Default

To turn off one of Vue Select's defaults, remove it from the map. The key then only does what the
browser does. This keeps <kbd>Backspace</kbd> from removing selected values, while it still deletes
search text:

```js
const keepValuesOnBackspace = (map) => {
  const { Backspace, ...rest } = map
  return rest
}
```

## Example: Completing Email Addresses

This handler listens for <kbd>@</kbd> and completes the address with `@gmail.com`. It only steps in
when there's text before the `@`; otherwise the key types normally.

::guide-keydown-email
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const emails = ref([])

const handlers = (map, ctx) => ({
  ...map,
  '@': (e) => {
    if (!ctx.search.value || ctx.search.value.includes('@')) return
    e.preventDefault()
    ctx.setSearch(`${ctx.search.value}@gmail.com`)
  },
})
</script>

<template>
  <VueSelect v-model="emails" taggable multiple :map-keydown="handlers" />
</template>
```

## Listening Without Changing Behavior

To react to keys without changing what they do, listen to the `search:keydown` event instead. It
fires for every keydown on the search input:

```vue
<VueSelect @search:keydown="(event) => console.log(event.key)" />
```
