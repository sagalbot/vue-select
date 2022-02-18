<template>
  <v-select
    v-model="selected"
    :reduce="(option) => option.id"
    :options="[
      { label: 'One', id: 1 },
      { label: 'Two', id: 2 },
    ]"
  />
</template>

<script>
export default {
  data() {
    return {
      selected: 3,
    }
  },
}
</script>
