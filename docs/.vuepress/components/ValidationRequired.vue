<template>
  <form @submit.stop="onSubmit">
    <v-select v-model="selected" :options="books" label="title">
      <template #search="{ attributes, events }">
        <input
          :required="!selected"
          class="vs__search"
          v-bind="attributes"
          v-on="events"
        />
      </template>
    </v-select>

    <input type="submit" />
  </form>
</template>

<script>
import books from '../data/books'
export default {
  data: () => ({
    books,
    selected: null,
  }),
  methods: {
    onSubmit() {
      alert('Submitted!')
    },
  },
}
</script>

<style scoped>
form {
  display: flex;
  align-items: stretch;
}

.v-select {
  width: 75%;
}

input[type='submit'] {
  margin-left: 1rem;
  background: #44ae7d;
  border: none;
  border-radius: 3px;
  color: #fff;
  width: 20%;
}
</style>
