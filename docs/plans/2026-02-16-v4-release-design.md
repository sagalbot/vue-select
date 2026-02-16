# Vue Select v4.0 Release Design

## Overview

Vue Select v4.0 will ship with two complementary offerings:

1. **Headless primitives** -- composable, unstyled components for building custom select UIs
2. **Styled `VueSelect` wrapper** -- a batteries-included component that composes the headless primitives with opinionated defaults and the existing CSS variable system

The goal is to complete the Vue 3 migration, modernize the component architecture, simplify the prop surface, and ship with proper documentation including a v3-to-v4 upgrade guide and versioned docs.

## Architecture

### Dual-Export Model

```
vue-select/
  Headless primitives (composable, unstyled)
    ComboBox          - root provider (state + context via provide/inject)
    ComboBoxInput     - search input
    ComboBoxButton    - toggle trigger
    ComboBoxMenu      - dropdown list container
    ComboBoxOption    - individual option

  Styled component (batteries-included)
    VueSelect         - composes primitives + CSS variables + opinionated defaults
```

### Package Exports

```ts
// Default export: plug-and-play (backward compatible where possible)
import VueSelect from 'vue-select'

// Named exports: headless primitives
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxMenu,
  ComboBoxOption,
} from 'vue-select'

// Composables
import { useComboBox } from 'vue-select'
```

### State Management

The `ComboBox` root component uses Vue's `provide`/`inject` to share state with child primitives. This pattern is already established in the WIP `src/components/ComboBox/` code. The `useComboBox` composable exposes the same state for advanced use cases outside the component tree.

### Technology Stack

- **Build:** Vite 6 (already configured)
- **Test:** Vitest 3 + @vue/test-utils v2 + JSDOM (already configured)
- **Language:** TypeScript (`<script setup lang="ts">` for all new components)
- **CSS:** CSS custom properties (`--vs-*` variables, no SCSS)
- **Docs:** Nuxt 3 + @nuxt/content
- **Release:** semantic-release with conventional commits

## Workstreams

### Plan 1: Headless Primitives

Complete the composition API primitives that exist as WIP in `src/components/ComboBox/`.

**Scope:**
- Finish `ComboBox`, `ComboBoxInput`, `ComboBoxMenu`, `ComboBoxOption`, `ComboBoxButton`
- Implement composable hooks (`useComboBox.ts`, `useModelValue.ts` -- currently empty stubs)
- Full keyboard navigation and ARIA compliance
- Filtering, tagging, multi-select support
- TypeScript types throughout
- Comprehensive test suite for all primitives

**Starting point:** Existing WIP in `src/components/ComboBox/` and `src/hooks/`

### Plan 2: Styled VueSelect Wrapper

Build the batteries-included component that composes the headless primitives.

**Scope:**
- Wraps headless primitives with the existing CSS variable system
- Prop surface emerges from what primitives need (slimmed down from current 28+)
- Backward compatibility with current beta API where reasonable
- Migration path from existing `Select.vue`
- Tests

**Depends on:** Plan 1 (primitives API must be stable)

### Plan 3: Documentation

Three phases that overlap with other workstreams.

**Phase A: v3 Archive + Framework (no dependencies, start immediately)**
- Port existing VitePress v3 docs markdown into `docs/content/v3/`
- Update internal links to be relative within `/v3/`
- Add banner on v3 pages linking to v4 docs
- Ensure Nuxt routing serves `/v3/*` content

**Phase B: v4 Content Updates (start immediately, finalize after API stabilizes)**
- Fix all stale v3 references in existing docs:
  - `value` prop -> `modelValue`
  - `@input` event -> `update:modelValue`
  - SCSS references -> CSS custom properties
  - Vue 2 registration syntax -> Vue 3 syntax
  - `createElement` render function examples -> Vue 3 `h()` or `<template>`
- Update API reference (props, events, slots)

**Phase C: New Content (depends on Plans 1 + 2)**
- v4 upgrade guide:
  - Breaking changes summary table
  - v-model migration walkthrough
  - CSS migration (SCSS -> CSS custom properties)
  - New headless primitives intro
  - Step-by-step migration recipes
- Headless primitives usage guide
- Composition patterns documentation

**URL Structure:**
```
vue-select.org/                    -> v4 docs (default)
vue-select.org/guide/install       -> v4 getting started
vue-select.org/guide/upgrade       -> v3 to v4 migration guide
vue-select.org/guide/headless      -> headless primitives guide
vue-select.org/api/props           -> v4 API reference
vue-select.org/v3/                 -> archived v3 docs
vue-select.org/v3/guide/...        -> all existing v3 content
```

### Plan 4: Release Engineering

**Scope:**
- Branch audit: scan `@beta/*` branches for work worth pulling in
- CI/CD validation: semantic-release config, build pipeline, bundlewatch
- Merge strategy: `@beta/dev` -> `beta` -> `master`
- npm publish plan: final beta(s) -> v4.0.0 stable
- Clean up stale branches

**Depends on:** Plans 1, 2, 3

## Dependency Graph

```
Plan 1: Headless Primitives ──────────┐
  (ComboBox architecture,              │
   hooks, types, tests)                ├──> Plan 2: Styled VueSelect Wrapper
                                       │     (composes primitives, CSS,
Plan 3: Documentation                  │      backward compat)
  Phase A: v3 archive + framework      │
    (runs immediately, no deps)        │
  Phase B: v4 content updates          │──> Plan 4: Release Engineering
    (start now, finalize after         │     (CI, merge strategy, publish)
     primitives API stabilizes)        │
  Phase C: Headless + upgrade guide    │
    (needs Plan 1 + 2 done)       ────┘
```

## What Can Start Now

- **Plan 1:** Build on existing ComboBox WIP
- **Plan 3 Phase A:** Port v3 docs into Nuxt `/v3/` route
- **Plan 3 Phase B:** Fix stale v4 doc content
- **Branch audit** (minor task from Plan 4)

## What Waits

- **Plan 2** (styled wrapper) waits for primitives API to stabilize
- **Plan 3 Phase C** (upgrade guide, headless docs) waits for Plans 1 + 2
- **Plan 4** (release) waits for everything

## Key Decisions Made

1. **Ship both headless primitives and styled wrapper** in v4.0
2. **Prop surface determined by building primitives** -- don't pre-decide, let the API emerge
3. **`@beta/dev` is the canonical branch** -- other @beta/* branches are reference/stale (audit to confirm)
4. **Parallel workstreams, ship when ready** -- no artificial timeline pressure
5. **v3 docs archived under `/v3/` path** via content migration into Nuxt
6. **Each plan gets its own detailed implementation plan** in a separate planning session

## Current Project State (as of 2026-02-16)

- **Branch:** `@beta/dev`
- **Version:** `4.0.0-beta.6`
- **Component:** Options API `Select.vue` (shipped in beta) + WIP Composition API `ComboBox/`
- **Tests:** Vitest 3, all test existing `Select.vue` only
- **Docs:** Nuxt 3 + @nuxt/content, content largely stale v3
- **Tracking issue:** [#1597](https://github.com/sagalbot/vue-select/issues/1597)
- **236 files changed** between master and @beta/dev (18,851 insertions, 25,414 deletions)
