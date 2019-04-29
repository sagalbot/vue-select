<template>
  <div>
    <v-select
            multiple
            v-model="selected"
            :options="['Canada', 'United States']"
            :components="{OpenIndicator}"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: ['Canada'],
    OpenIndicator: {
      render: createElement => createElement('span', {class: {'toggle': true}}),
    },
  }),
};
</script>
