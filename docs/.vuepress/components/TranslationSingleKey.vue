<template>
  <v-select :locale="locale" :option="['one', 'two', 'three']" />
</template>

<script>
export default {
  computed: {
    locale() {
      return (text) => ({
        ...text,
        noOptions: { text: 'No Options found!!' },
      })
    },
  },
}
</script>
