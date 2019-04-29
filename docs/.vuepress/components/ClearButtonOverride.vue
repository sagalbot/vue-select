<template>
  <div>
    <v-select
            :options="['Canada', 'United States']"
            :components="{Deselect}"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    Deselect: {
      render: createElement => createElement('button', 'Clear'),
    },
  }),
};
</script>
