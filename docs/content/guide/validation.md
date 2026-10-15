---
title: Validation
section: Use Cases
description: Make a selection required in a native form, submit the value with the form, and show validation errors accessibly.
---

## Required

To make sure a selection is made before a form is submitted, use the browser's built-in
validation with the `required` attribute.

The search input never holds the selected value (it only holds what the user types), so adding
`required` to it permanently would block every submission. Instead, bind `required` only while
nothing is selected, through [`inputAttrs`](/guide/accessibility#input-attributes):

::guide-validation-required
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'
import { books } from './data'

const selected = ref(null)
const submitted = ref(false)
</script>

<template>
  <form @submit.prevent="submitted = true">
    <label for="guide-book">Book</label>
    <div class="row">
      <VueSelect
        v-model="selected"
        class="grow"
        label="title"
        :options="books"
        :input-attrs="{ id: 'guide-book', required: !selected }"
        @update:model-value="submitted = false"
      />
      <button type="submit">Submit</button>
    </div>
    <p v-if="submitted" class="success">Submitted {{ selected.title }}!</p>
  </form>
</template>
```

For a multiple select, use `required: !selected.length`.

The [`search` slot](/guide/slots#the-search-input) works too, if you're already rendering your own
input:

```vue
<VueSelect v-model="selected" :options="books" label="title">
  <template #search="{ attributes, events }">
    <input :required="!selected" v-bind="attributes" v-on="events" />
  </template>
</VueSelect>
```

## Submitting the Value with a Form

Vue Select doesn't render a form field for its value. If your form is submitted by the browser
rather than from JavaScript, add a hidden input:

```vue
<VueSelect v-model="country" :options="countries" :reduce="(country) => country.code" />
<input type="hidden" name="country" :value="country ?? ''" />
```

## Showing Errors

When you validate in JavaScript (yourself or with a library), show the error next to the field and
connect it to the input, so screen readers announce it:

```vue
<template>
  <label for="country">Country</label>
  <VueSelect
    v-model="country"
    :options="countries"
    :input-attrs="{
      id: 'country',
      'aria-invalid': !!error,
      'aria-describedby': error ? 'country-error' : undefined,
    }"
  />
  <p v-if="error" id="country-error" class="error">{{ error }}</p>
</template>
```

To reject invalid input in a [taggable](/guide/tagging) select, throw from `createOption`; see
[Validating Tags](/guide/tagging#validating-tags).
