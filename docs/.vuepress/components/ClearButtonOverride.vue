<template>
  <div>
    <v-select
      v-model="selected"
      placeholder="choose a country"
      :components="{ Deselect }"
      :options="['Canada', 'United States']"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: 'Canada',
    Deselect: {
      render: (createElement) => createElement('span', '❌'),
    },
  }),
}
</script>
