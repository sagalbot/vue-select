---
hero: true
hideToc: true
title: Vue Select
section: Introduction
description: Everything you wish the HTML select element could do, shipped as a lightweight, accessible and extendable Vue component.
---

:::lead
Vue Select is a feature rich combobox component for Vue 3. You might know it as a dropdown or
typeahead select. They're a staple on the web, and they're notoriously tough to get right!
:::

Vue Select provides a default template that fits most use cases. The component is designed
to be as lightweight as possible, while maintaining high standards for accessibility, developer
experience, and customization. When the default template doesn't fit, the same behavior is
available as unstyled headless components.

:::quick-links

:::quick-link{title="Installation" icon="installation" href="/guide/install"}
Step-by-step instructions to install Vue Select in your project. Couple lines and you're done!

#icon
<svg data-name="arrow-down-tray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
<path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
</svg>
:::

:::quick-link{title="Options and Selections" icon="options" href="/guide/options"}
You'll need to register some options so your users can select them.

#icon
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
</svg>
:::

:::quick-link{title="Customizing" icon="customizing" href="/guide/slots"}
Vue Select is plug-and-play by design, but slots and CSS variables let you change the look and feel.

#icon
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>
:::

:::quick-link{title="Headless Components" icon="headless" href="/guide/headless"}
Build your own markup and styles on top of the same accessible combobox behavior.

#icon
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
</svg>
:::

:::quick-link{title="Accessibility" icon="accessibility" href="/guide/accessibility"}
Keyboard support, screen reader semantics and labelling, following the WAI-ARIA combobox pattern.

#icon
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
</svg>
:::

:::quick-link{title="Upgrading from v3" icon="upgrade" href="/guide/upgrade"}
Moving from Vue Select 3? Here's everything that changed in v4, and how to migrate.

#icon
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
</svg>
:::

:::

## Features

- Single and multiple selection
- Filtering and searching, with your own filter if you need one
- Tagging
- Option groups
- AJAX support
- SSR support
- Accessible: follows the WAI-ARIA combobox pattern
- TypeScript types included
- Customizable with slots and CSS variables
- Headless components and a composable for fully custom markup
- Zero dependencies besides Vue

## Resources

- **[GitHub](https://github.com/sagalbot/vue-select)**
- **[Vue Select 3 documentation](/v3)** (Vue 2)
