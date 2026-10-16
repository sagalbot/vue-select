<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const limit = ref(10)
const search = ref('')
const load = useTemplateRef('load')
let observer

const filtered = computed(() =>
  countries.filter((country) =>
    country.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
)
const paginated = computed(() => filtered.value.slice(0, limit.value))
const hasNextPage = computed(() => paginated.value.length < filtered.value.length)

async function infiniteScroll([{ isIntersecting, target }]) {
  if (!isIntersecting) return
  const list = target.offsetParent
  const scrollTop = list.scrollTop
  limit.value += 10
  await nextTick()
  list.scrollTop = scrollTop
}

// IntersectionObserver doesn't exist during server rendering, so create it on mount
onMounted(() => (observer = new IntersectionObserver(infiniteScroll)))
onBeforeUnmount(() => observer?.disconnect())

async function onOpen() {
  if (!hasNextPage.value) return
  await nextTick()
  observer.observe(load.value)
}

function onClose() {
  observer.disconnect()
}

function onSearch(query) {
  search.value = query
  limit.value = 10
}
</script>

<template>
  <VueSelect
    :options="paginated"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="onSearch"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">Loading more options…</li>
    </template>
  </VueSelect>
</template>

<style scoped>
.loader {
  text-align: center;
  color: #94a3b8;
}
</style>
