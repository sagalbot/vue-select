<template>
  <div>
    <v-select
            placeholder="choose a country"
            v-model="selected"
            :components="{Deselect}"
            :options="['Canada', 'United States']"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: 'Canada',
    Deselect: {
      render: createElement => createElement('span', '❌'),
    },
  }),
};
</script>
