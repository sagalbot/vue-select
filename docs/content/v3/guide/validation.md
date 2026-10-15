---
title: "Validation"
section: "v3 · Use Cases"
version: v3
---

## Required

If you need to ensure that a selection is made before a form is submitted, you can 
use the `required` attribute in combination with the `search` scoped slot in order 
to do so.

However, the `search` input within the component does not actually store a value, so
simply adding the `required` attribute won't work. Instead, we'll bind the attribute
dynamically, so that it's only present if we don't have a selection.

```vue
<template>
  <form @submit.stop="onSubmit">
    <v-select v-model="selected" :options="books" label="title">
      <template #search="{ attributes, events }">
        <input
          :required="!selected"
          class="vs__search"
          v-bind="attributes"
          v-on="events"
        />
      </template>
    </v-select>

    <input type="submit" />
  </form>
</template>

<script>
import books from '../data/books'
export default {
  data: () => ({
    books,
    selected: null,
  }),
  methods: {
    onSubmit() {
      alert('Submitted!')
    },
  },
}
</script>

<style scoped>
form {
  display: flex;
  align-items: stretch;
}

.v-select {
  width: 75%;
}

input[type='submit'] {
  margin-left: 1rem;
  background: #44ae7d;
  border: none;
  border-radius: 3px;
  color: #fff;
  width: 20%;
}
</style>
```

```html
<v-select :options="books" label="title" v-model="selected">
  <template #search="{attributes, events}">
    <input
      class="vs__search"
      :required="!selected"
      v-bind="attributes"
      v-on="events"
    />
  </template>
</v-select>
```
