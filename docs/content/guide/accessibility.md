---
title: Accessibility
section: Accessibility
description: How Vue Select follows the WAI-ARIA combobox pattern, how to label it, and which keys it supports.
---

Vue Select follows the [WAI-ARIA Authoring Practices (APG) combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
The default component is an *editable* combobox, like the APG
[list autocomplete example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/).
With `:searchable="false"` it becomes a
[select-only combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/),
which behaves like a native `<select>`.

## Labelling

Every select needs an accessible name. The best way to give it one is a visible `<label>`. Pass the
input an `id` through `inputAttrs`, and point the label at it:

::guide-accessible-label
::

```vue
<template>
  <label for="country">Country</label>
  <VueSelect
    v-model="country"
    :options="countries"
    :input-attrs="{
      id: 'country',
      'aria-describedby': 'country-hint',
    }"
  />
  <p id="country-hint">Where you live today.</p>
</template>
```

Clicking the label focuses the input. You can also use `aria-labelledby` or `aria-label` in
`inputAttrs`.

If the input has no `id`, `aria-label` or `aria-labelledby`, Vue Select gives it
`aria-label="Search for option"` so it's never unnamed. That fallback doesn't describe *what* is
being chosen, so always provide a real label. The text of the fallback can be changed with
[`ariaLabels`](/guide/localization#accessible-names).

### Input Attributes

`inputAttrs` binds attributes to the search input (or, with `:searchable="false"`, to the focusable
combobox element). Use it for anything that belongs on the form control itself:

```vue
<VueSelect
  :input-attrs="{
    id: 'country',
    name: 'country-search',
    'aria-describedby': 'country-hint',
    'aria-invalid': hasError,
  }"
/>
```

Vue Select manages the combobox attributes itself (`role`, `aria-expanded`, `aria-controls`,
`aria-activedescendant` and `aria-autocomplete`), so don't set those in `inputAttrs`. Attributes set directly on `<VueSelect>`, like `class` or `id`, go
to the root `.v-select` element, not the input.

## Roles and States

| Element                         | Role and attributes                                                                                         |
|---------------------------------|-------------------------------------------------------------------------------------------------------------|
| Search input                    | `role="combobox"`, `aria-expanded`, `aria-controls` (the listbox), `aria-activedescendant` (the highlighted option), `aria-autocomplete="list"` |
| Dropdown menu                   | `role="listbox"`                                                                                             |
| Options                         | `role="option"`, `aria-selected` (whether it's selected), `aria-disabled` (not [selectable](/guide/selectable)) |
| [Option groups](/guide/options#option-groups) | `role="group"`, labelled by the group header                                                   |
| Toggle button                   | A `<button>` with `aria-label`, `aria-expanded` and `aria-controls`. It's outside the tab order (`tabindex="-1"`), as in the APG example, but available to pointer, touch and screen reader users. The chevron icon inside it is `aria-hidden`. |
| Clear button                    | A `<button>` labelled "Clear Selected"                                                                       |
| Deselect buttons (multiple)     | A `<button>` per selected value, labelled "Deselect *label*"                                                |

Focus stays on the input while the user moves through the options. The highlighted option is
communicated with `aria-activedescendant`, so screen readers announce it.

## Keyboard

### Editable (default)

| Key                 | Dropdown closed                                                         | Dropdown open                                                 |
|---------------------|-------------------------------------------------------------------------|---------------------------------------------------------------|
| Typing              | Opens the dropdown and filters the options                              | Filters the options; the first match is highlighted           |
| <kbd>↓</kbd>        | Opens, highlighting the selected option, or the first one               | Highlights the next option, wrapping to the first             |
| <kbd>↑</kbd>        | Opens, highlighting the selected option, or the last one                | Highlights the previous option, wrapping to the last          |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Opens without moving the highlight                              | Same as <kbd>↓</kbd>                                          |
| <kbd>Enter</kbd>    | Nothing                                                                 | Selects the highlighted option, or closes if none is highlighted |
| <kbd>Space</kbd>    | Opens the dropdown                                                      | Types a space                                                 |
| <kbd>Escape</kbd>   | Clears the search text                                                  | Closes the dropdown                                           |
| <kbd>Backspace</kbd> | With an empty search, removes the last selected value (when `clearable`) | Same                                                       |
| <kbd>Tab</kbd>      | Moves focus                                                             | Closes the dropdown and moves focus                           |

### Select-only

With `:searchable="false"`:

::vue-select{:searchable="false" :options='["Apple","Apricot","Banana","Blueberry","Cherry"]' placeholder="Choose a fruit"}
::

| Key                         | Behavior                                                                      |
|-----------------------------|-------------------------------------------------------------------------------|
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Open the dropdown, or select the highlighted option                     |
| <kbd>↓</kbd>, <kbd>↑</kbd>  | Open the dropdown, or move the highlight. The highlight doesn't wrap.         |
| <kbd>Alt</kbd>+<kbd>↑</kbd> | Select the highlighted option and close                                       |
| <kbd>Home</kbd>, <kbd>End</kbd> | Open and highlight the first or last option                               |
| <kbd>Page Up</kbd>, <kbd>Page Down</kbd> | Move the highlight by 10 options                                 |
| <kbd>Tab</kbd>              | Select the highlighted option and move focus                                  |
| <kbd>Escape</kbd>           | Close the dropdown                                                            |
| Letters                     | Highlight the next option starting with the typed text. Repeating a letter cycles through the matches. |

A click anywhere on a select-only field toggles the dropdown.

You can change or add key bindings with [`mapKeydown`](/guide/keydown).

## Opening the Dropdown

Moving focus into the field doesn't open the dropdown, so keyboard and screen reader users can tab
through a form without lists popping open (and interrupting the field's announcement). Typing,
<kbd>↓</kbd>, or the toggle button open it. You can opt in to opening on focus with `openOnFocus`;
see [Dropdown Opening](/guide/opening).

## Focus Visibility

The default theme doesn't draw a focus ring on the field. Make sure your app shows one, for example
with `:focus-within`; see [CSS & Theming](/guide/css#focus-styles).

## Autocomplete Behavior

The APG describes several kinds of autocomplete for an editable combobox:

- **List autocomplete** (the default): typing filters the options and highlights the first match,
  and <kbd>Enter</kbd> selects it.
- **No autocomplete**: the list shows the same options whatever the user types. Set
  `:filterable="false"`, for example when you [filter on the server](/guide/ajax).
- **Free text**: with [`taggable`](/guide/tagging), the typed text is offered as an option too.
- **Inline autocomplete**, which completes the typed text inside the input, isn't supported yet
  ([#865](https://github.com/sagalbot/vue-select/issues/865)).
