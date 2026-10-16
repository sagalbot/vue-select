---
title: CSS Variables
section: API
description: Every CSS custom property in the vue-select stylesheet, with its default value and what it styles.
---

The stylesheet (`vue-select/style.css`, also available as `vue-select/dist/vue-select.css`) defines
its colors, borders, sizes and timing as CSS custom properties on `:root` and `:host`. Override them
globally, or on an element that contains the select to change only that instance:

```css
/* every select in the app */
:root {
  --vs-border-radius: 8px;
  --vs-dropdown-option--active-bg: #7c3aed;
}

/* one select: <VueSelect class="compact" /> */
.compact {
  --vs-font-size: 0.875rem;
  --vs-controls-size: 0.8;
}
```

::callout{type="warning" title="Teleported dropdowns"}
With [`appendTo`](/api/props#appendto), the dropdown menu is moved out of the component, so
variables set on the component or its ancestors don't reach it. Set dropdown variables on `:root`,
or on an ancestor of the `appendTo` target.
::

See [CSS & Selectors](/guide/css) for the class names and how to override other styles.

## Light and dark values

Color variables follow the page's `color-scheme` (see [Dark Mode](/guide/css#dark-mode)). Where a
variable has a dark value, the table shows both, as `light` / `dark`. To override one, set a
`light-dark(light, dark)` pair, or a single color for both schemes:

```css
:root {
  --vs-dropdown-bg: light-dark(#fff, #0f172a);
}
```

## Base colors

Shared colors that other variables default to.

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-colors--lightest` | `rgba(60, 60, 60, 0.26)` / `rgba(255, 255, 255, 0.2)` | default of `--vs-border-color` |
| `--vs-colors--light` | `rgba(60, 60, 60, 0.5)` / `rgba(255, 255, 255, 0.45)` | default of `--vs-controls-color`, `--vs-state-disabled-color` and `--vs-state-disabled-controls-color` |
| `--vs-colors--dark` | `#333` / `#e4e4e7` | default of `--vs-selected-color` |
| `--vs-colors--darkest` | `rgba(0, 0, 0, 0.15)` / `rgba(0, 0, 0, 0.5)` | the color in `--vs-dropdown-box-shadow` |

## Search input and field

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-search-input-color` | `inherit` | search text color |
| `--vs-search-input-bg` | `rgb(255, 255, 255)` / `#18181b` | background of the field (`.vs__dropdown-toggle`) |
| `--vs-search-input-placeholder-color` | `inherit` | placeholder color |
| `--vs-font-size` | `1rem` | search input font size |
| `--vs-line-height` | `1.4` | search input and selected options |

## Borders

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-border-color` | `var(--vs-colors--lightest)` | field and dropdown border |
| `--vs-border-width` | `1px` | field and dropdown border |
| `--vs-border-style` | `solid` | field and dropdown border |
| `--vs-border-radius` | `4px` | field, dropdown and selected option corners |

## Controls

The clear button, the open indicator and the deselect buttons on selected options.

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-actions-padding` | `4px 4px 0 3px` | padding of `.vs__actions`, which holds the clear button, open indicator and spinner |
| `--vs-controls-color` | `var(--vs-colors--light)` | icon color (`fill`) of the clear, open indicator and deselect icons |
| `--vs-controls-size` | `1` | scale factor for the clear and open indicator icons and the spinner (`1` is 20px icons) |
| `--vs-controls-icon-size` | `calc(1.25rem * var(--vs-controls-size))` | width and height of the clear and open indicator icons |
| `--vs-deselect-icon-size` | `1rem` | width and height of the deselect icon on selected options |
| `--vs-controls--deselect-text-shadow` | `0 1px 0 #fff` / `0 1px 0 transparent` | text shadow of the deselect button |
| `--vs-controls--spinner-size` | `var(--vs-controls-size)` | scale factor for the loading spinner |
| `--vs-spinner-color` | `rgba(60, 60, 60, 0.45)` / `rgba(255, 255, 255, 0.6)` | the spinner's moving segment |
| `--vs-spinner-track-color` | `rgba(100, 100, 100, 0.1)` / `rgba(255, 255, 255, 0.12)` | the rest of the spinner ring |

## Selected options

The selected options in the field. In single mode the background and border are transparent.

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-selected-bg` | `#f0f0f0` / `#27272a` | background |
| `--vs-selected-color` | `var(--vs-colors--dark)` | text color |
| `--vs-selected-border-color` | `var(--vs-border-color)` | border color |
| `--vs-selected-border-style` | `var(--vs-border-style)` | border style |
| `--vs-selected-border-width` | `var(--vs-border-width)` | border width |

## Dropdown

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-dropdown-bg` | `#fff` / `#18181b` | background |
| `--vs-dropdown-color` | `inherit` | text color, and default of `--vs-dropdown-option-color` |
| `--vs-dropdown-z-index` | `1000` | `z-index` |
| `--vs-dropdown-min-width` | `160px` | minimum width |
| `--vs-dropdown-max-height` | `350px` | maximum height before it scrolls |
| `--vs-dropdown-box-shadow` | `0px 3px 6px 0px var(--vs-colors--darkest)` | shadow |

## Options

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-dropdown-option-color` | `var(--vs-dropdown-color)` | option text color |
| `--vs-dropdown-option-padding` | `3px 20px` | option and group label padding |
| `--vs-dropdown-group-label-color` | `#666` / `#a1a1aa` | text color of option [group](/guide/options#option-groups) labels (5.7:1 on white) |
| `--vs-dropdown-option--active-bg` | `#136cfb` | background of the highlighted option |
| `--vs-dropdown-option--active-color` | `#fff` | text color of the highlighted option |
| `--vs-dropdown-option--deselect-bg` | `#fb5858` | background of a highlighted selected option that choosing would deselect ([`deselectFromDropdown`](/api/props#deselectfromdropdown)) |
| `--vs-dropdown-option--deselect-color` | `#fff` | text color of that option |

The default highlight color has a 4.6:1 contrast ratio with white text (WCAG AA). Keep that in mind
when you change either variable.

## Focus

While focus is inside the field, its border takes `--vs-focus-color` and it gets the
`--vs-focus-ring` shadow. The clear, deselect and toggle buttons show a 2px `--vs-focus-color`
outline when focused from the keyboard (`:focus-visible`).

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-focus-color` | `#136cfb` / `#60a5fa` | border of the focused field, and the outline of focused buttons |
| `--vs-focus-ring` | `0 0 0 1px var(--vs-focus-color)` | `box-shadow` around the focused field; set it to `none` to remove the ring |

```css
:root {
  --vs-focus-color: #7c3aed;
  --vs-focus-ring: 0 0 0 3px rgb(124 58 237 / 0.3);
}
```

## Disabled state

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-state-disabled-bg` | `rgb(248, 248, 248)` / `#27272a` | background of options rejected by [`selectable`](/api/props#selectable), and default of `--vs-disabled-bg` |
| `--vs-state-disabled-color` | `var(--vs-colors--light)` | text color of options rejected by `selectable` |
| `--vs-state-disabled-cursor` | `not-allowed` | cursor over options rejected by `selectable`, and default of `--vs-disabled-cursor` |
| `--vs-state-disabled-controls-color` | `var(--vs-colors--light)` | icon color of the clear, deselect and open indicator icons when the component is [`disabled`](/api/props#disabled) |
| `--vs-disabled-bg` | `var(--vs-state-disabled-bg)` | background of the field and its controls when the component is disabled |
| `--vs-disabled-color` | `var(--vs-state-disabled-color)` | text color of the search input and the selected options when the component is disabled |
| `--vs-disabled-cursor` | `var(--vs-state-disabled-cursor)` | cursor over the field and its controls when the component is disabled |

## Transitions

| Variable | Default | Used for |
| --- | --- | --- |
| `--vs-transition-timing-function` | `cubic-bezier(1, 0.5, 0.8, 1)` | the dropdown fade and the open indicator rotation |
| `--vs-transition-duration` | `150ms` | the dropdown fade and the open indicator rotation |

The dropdown fades in when it opens and fades out when it closes (the `vs__fade`
[`transition`](/api/props#transition)).
