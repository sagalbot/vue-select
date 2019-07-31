<template>
  <v-select
          :options="['Vue.js', 'React', 'Angular']"
          :components="{Deselect, OpenIndicator}"
  />
</template>

<script>
export default {
  data: () => ({
    Deselect: {
      render: createElement => createElement('span', '❌'),
    },
    OpenIndicator: {
      render: createElement => createElement('span', '🔽'),
    },
  }),
};
</script>
