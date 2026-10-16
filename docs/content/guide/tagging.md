---
title: Tagging
section: Getting Started
description: Let users create options that aren't in the list, control the shape of new tags, and reject invalid input.
---

## Creating Tags

The `taggable` prop lets users select values that aren't in `options`. While they type, the search
text is offered as the first option in the dropdown, so pressing Enter selects it.

```vue
<VueSelect taggable multiple />
```

::vue-select{taggable multiple placeholder="Type anything and press Enter"}
::

Tagging works with single selects too. Without `multiple`, the tag replaces the current value.

## Tag Inputs Without a Dropdown

For a free-form tag input, with no list of options to choose from, keep the dropdown closed with
`:open="false"`. <kbd>Enter</kbd> still turns the search text into a tag. Here a comma does too,
through [`mapKeydown`](/guide/keydown#comma):

::guide-tagging-no-dropdown
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const tags = ref(['vue', 'select'])
</script>

<template>
  <VueSelect
    v-model="tags"
    taggable
    multiple
    :open="false"
    :map-keydown="(map) => ({ ...map, ',': map.Enter })"
  />
</template>
```

<kbd>Backspace</kbd> in the empty input removes the last tag, and each tag has its own remove
button.

## Adding Tags to the Options

New tags are selected, but they aren't added to `options`. Once a tag is deselected it's gone from
the dropdown. To keep tags around, add them to your options when the `option:created` event fires:

::guide-tagging-created
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = ref(['Vue', 'React', 'Svelte'])
const selected = ref([])
</script>

<template>
  <VueSelect
    v-model="selected"
    taggable
    multiple
    :options="options"
    @option:created="(tag) => options.push(tag)"
  />
</template>
```

::callout{type="note" title="Replaces push-tags"}
Vue Select 3 had a `push-tags` prop for this. It kept a hidden copy of your options inside the
component, which drifted out of sync with the `options` prop. In v4 your options are the only copy.
::

## The Shape of New Tags

By default a tag has the same shape as your options. If the options are strings, the tag is the
search text. If they're objects, the tag is `{ [label]: searchText }`, using the
[`label` prop](/guide/options#objects).

When your options have more structure, or you're using `reduce`, define the shape yourself with
`createOption`. It receives the search text and returns the new option, which should look like the
rest of your `options`:

::guide-tagging-reduce
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const books = ref([
  { id: 1, title: "Old Man's War" },
  { id: 2, title: 'The Lock Artist' },
])

const selected = ref([1])

const createBook = (title) => ({ id: `new:${title}`, title })
</script>

<template>
  <VueSelect
    v-model="selected"
    taggable
    multiple
    label="title"
    :options="books"
    :create-option="createBook"
    :reduce="(book) => book.id"
    @option:created="(book) => books.push(book)"
  />
</template>
```

::callout{type="warning" title="Tagging with reduce"}
When you combine `taggable` and `reduce`, always define `createOption`. `reduce` runs on new tags
as well, so a tag has to have whatever property `reduce` reads.
::

A tag isn't offered when an option with the same [key](/guide/options#option-keys) already exists,
so users can't create duplicates of existing options.

## Validating Tags

To reject some input, throw an error from `createOption`. While it throws, no tag is offered for
the current search text, so the user can't select it. This one only accepts email addresses:

::guide-tagging-validation
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const recipients = ref([])

function createOption(text) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    throw new Error('Not an email address')
  }
  return text.toLowerCase()
}
</script>

<template>
  <VueSelect
    v-model="recipients"
    taggable
    multiple
    :create-option="createOption"
    placeholder="Add email addresses"
  >
    <template #no-options="{ search }">
      <template v-if="search">Keep typing: "{{ search }}" isn't an email address yet.</template>
      <template v-else>Type an email address.</template>
    </template>
  </VueSelect>
</template>
```

## Filtering

Tagging always filters the options by the search text, even with `:filterable="false"`, so the
list shows what matches what the user is typing.

## Creating Tags with Other Keys

<kbd>Enter</kbd> selects the highlighted tag, and creates the tag even while the dropdown is closed.
To also create tags with a comma, <kbd>Tab</kbd> or another key, see
[Keydown Events](/guide/keydown#selecting-with-other-keys).
