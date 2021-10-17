<template>
  <div>
    <v-select
      v-model="selected"
      multiple
      :options="['Canada', 'United States']"
      :components="{ Deselect }"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: ['Canada'],
    Deselect: {
      render: (createElement) => createElement('span', '❌'),
    },
  }),
}
</script>
