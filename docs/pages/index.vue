<script setup lang="ts">
import '../src/css/vue-select.css'

useHead({
  title: 'Vue Select',
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout :hero="true" name="default">
    <Prose>
      <Lead>
        Vue Select is a feature rich combobox component. You might know it as a
        dropdown or typeahead select. They're a staple on the web, and they're
        notoriously tough to get right!
      </Lead>

      <p>
        Vue Select provides a default template that fits most use cases. The
        component is designed to be as lightweight as possible, while
        maintaining high standards for accessibility, developer experience, and
        customization.
      </p>

      <QuickLinks>
        <QuickLink title="Installation" href="/guide/install">
          Step-by-step instructions to install Vue Select in your project.
          Couple lines and you're done!
          <template #icon>
            <svg
              data-name="arrow-down-tray"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
          </template>
        </QuickLink>

        <QuickLink title="Options and Selections" href="/">
          You'll need to register some options so your users can select them.
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
              />
            </svg>
          </template>
        </QuickLink>

        <QuickLink title="Customizing" href="/">
          Vue Select is plug-and-play by design, but you can always customize
          the look and feel.
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </template>
        </QuickLink>

        <QuickLink title="Premium Resources" href="/">
          Pre-built Vue Select instances with custom themes and features.
          Infinite scroll, remote option loading and more.
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
          </template>
        </QuickLink>
      </QuickLinks>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Tagging</li>
          <li>Filtering / Searching</li>
          <li>Vuex Support</li>
          <li>AJAX Support</li>
          <li>SSR Support</li>
          <li>Accessible</li>
          <li>~20kb Total / ~5kb CSS / ~15kb JS</li>
          <li>Select Single/Multiple Options</li>
          <li>Customizable with slots and SCSS variables</li>
          <li>Zero dependencies</li>
        </ul>
      </section>

      <section>
        <h2>Resources</h2>
        <ul>
          <li><a href="https://github.com/sagalbot/vue-select">GitHub</a></li>
          <li>
            <a href="http://codepen.io/sagalbot/pen/NpwrQO">CodePen Template</a>
          </li>
        </ul>
      </section>
    </Prose>
  </NuxtLayout>
</template>
