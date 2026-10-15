---
title: Localization
section: Accessibility
description: Translate Vue Select's built-in text and accessible names, and support right-to-left languages.
---

## Right to Left

Vue Select supports right-to-left languages through the `dir` prop, which sets the
[HTML `dir` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) on
the component. It accepts `ltr`, `rtl` and `auto` (the default).

```vue
<VueSelect dir="rtl" :options="['كندا', 'مصر', 'المغرب']" />
```

::vue-select{dir="rtl" :options='["كندا","مصر","المغرب"]'}
::

## Component Text

Vue Select renders a small amount of English text. All of it can be replaced, either through the
`ariaLabels` prop (text that's only announced by screen readers) or through slots (text that's
displayed).

::guide-localization
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(['Canada'])

const ariaLabels = {
  toggle: 'Afficher les options',
  search: 'Rechercher un pays',
  clear: 'Effacer la sélection',
  deselect: (label) => `Retirer ${label}`,
}
</script>

<template>
  <VueSelect
    v-model="selected"
    multiple
    placeholder="Choisissez un pays"
    :options="['Canada', 'France', 'Belgique', 'Suisse']"
    :aria-labels="ariaLabels"
  >
    <template #no-options>Désolé, aucune option ne correspond.</template>
    <template #spinner="{ loading }">
      <div v-show="loading" class="vs__spinner">Chargement…</div>
    </template>
  </VueSelect>
</template>
```

### Accessible Names

The `ariaLabels` prop sets the accessible names of the controls Vue Select renders. Each key is
optional; missing keys keep their English default.

| Key        | Labels                                     | Default                |
|------------|--------------------------------------------|------------------------|
| `toggle`   | The button that opens and closes the dropdown | `'Toggle options'`  |
| `search`   | The search input, when it has no other label (see below) | `'Search for option'` |
| `clear`    | The clear button                           | `'Clear Selected'`     |
| `deselect` | Each selected value's deselect button. A function that receives the option's label and the option. | `` (label) => `Deselect ${label}` `` |

`search` is only a fallback. When you label the input properly, with an `id` and a `<label>`, or
with `aria-label` or `aria-labelledby` in [`inputAttrs`](/guide/accessibility#input-attributes),
that label is used instead.

The labels are also used as the buttons' `title` tooltips.

### Displayed Text

| Text                             | How to change it                                                |
|----------------------------------|-----------------------------------------------------------------|
| _Sorry, no matching options._    | The [`no-options` slot](/guide/slots#no-options-text)            |
| _Loading..._ (visually hidden inside the spinner) | The `spinner` slot                            |
| The placeholder                  | The `placeholder` prop                                          |

When you replace the spinner, keep the `vs__spinner` class if you want the default animation; it
hides the text visually.

If your app supports several languages, compute `ariaLabels` and the slot content from your i18n
library, for example with [vue-i18n](https://vue-i18n.intlify.dev/):

```vue
<VueSelect
  :placeholder="t('country.placeholder')"
  :aria-labels="{
    toggle: t('select.toggle'),
    clear: t('select.clear'),
    deselect: (label) => t('select.deselect', { label }),
  }"
>
  <template #no-options>{{ t('select.noOptions') }}</template>
</VueSelect>
```

## Filtering

The default filter compares the option label and the search text case-insensitively, using
`toLocaleLowerCase()`. It doesn't ignore accents, so searching for "Quebec" won't find
"Québec". To match without diacritics, provide your own filter; see
[Option Filtering](/guide/filtering#ignoring-accents).
