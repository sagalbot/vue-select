<template>
  <div>
    <v-select
      v-model="selected"
      :options="books"
      :limit="2"
      multiple
      label="title"
   >
      <template #option="{ title, author }">
        <h3 style="margin: 0">{{ title }}</h3>
        <em>{{ author.firstName }} {{ author.lastName }}</em>
      </template>
      <template #limit="{ length }">
        <span>and {{ length }} more</span>
      </template>
    </v-select>
  </div>
</template>
<script>
const books = [
  {
    title: "Old Man's War",
    author: {
      firstName: 'John',
      lastName: 'Scalzi',
    },
  },
  {
    title: 'To Kill a Mockingbird',
    author: {
      firstName: 'Harper',
      lastName: 'Lee',
    },
  },
  {
    title: 'The Great Gatsby',
    author: {
      firstName: 'F. Scott',
      lastName: 'Fitzgerald',
    },
  },
]

export default {
  data: () => ({
    books: books,
    selected: books,
  }),
}
</script>
