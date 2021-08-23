<template>
  <v-select :options="books" label="title">
    <template
      #selected-option-container="{ option, deselect, multiple, disabled }"
    >
      <div class="vs__selected">{{ option.title }}</div>
    </template>
  </v-select>
</template>

<script>
export default {
  data: () => ({
    books: [
      {
        title: "Old Man's War",
        author: {
          firstName: 'John',
          lastName: 'Scalzi',
        },
      },
    ],
  }),
}
</script>
