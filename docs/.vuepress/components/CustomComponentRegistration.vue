<template>
  <v-select
          :options="['Vue.js', 'React', 'Angular']"
          :components="components"
  />
</template>

<script>
export default {
  data: () => ({
    components: {
      Deselect: {
        render: createElement => createElement('button', '❌'),
      },
      OpenIndicator: {
        render: createElement => createElement('span', '🔽'),
      },
    },
  }),
};
</script>
