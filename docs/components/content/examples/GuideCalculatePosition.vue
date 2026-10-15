<script setup>
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

function calculatePosition(menu, ctx, { width }) {
  // The field the dropdown belongs to
  const toggle = ctx.inputEl.value.closest('.vs__dropdown-toggle')

  function update() {
    const field = toggle.getBoundingClientRect()
    const spaceBelow = window.innerHeight - field.bottom
    const above = spaceBelow < menu.offsetHeight && field.top > spaceBelow

    menu.style.width = width
    menu.style.left = `${window.scrollX + field.left}px`
    menu.style.top = above
      ? `${window.scrollY + field.top - menu.offsetHeight + 1}px`
      : `${window.scrollY + field.bottom - 1}px`
    menu.classList.toggle('drop-up', above)
  }

  update()
  window.addEventListener('scroll', update, true)
  window.addEventListener('resize', update)

  // Called when the dropdown closes
  return () => {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }
}
</script>

<template>
  <VueSelect
    :options="countries"
    append-to="#teleports"
    :calculate-position="calculatePosition"
    placeholder="Scroll this field near the bottom of the window, then open it"
  />
</template>

<style>
.vs__dropdown-menu.drop-up {
  border-top-style: solid;
  border-bottom-style: none;
  border-radius: var(--vs-border-radius) var(--vs-border-radius) 0 0;
  box-shadow: 0 -3px 6px 0 var(--vs-colors--darkest);
}
</style>
