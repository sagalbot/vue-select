<template>
  <v-select :options="options">
    <li slot="list-footer" class="pagination">
      <button @click="offset -= 10" :disabled="disabled.prev">Prev</button>
      <button @click="offset += 10" :disabled="disabled.next">Next</button>
    </li>
  </v-select>
</template>

<script>
import countries from '../data/countries';
export default {
  data: () => ({
    countries,
    offset: 0,
    limit: 10,
  }),
  computed: {
    disabled() {
      return {
        prev: this.offset <= 0,
        next: this.offset >= this.countries.length
      }
    },
    options () {
      return this.countries.slice(this.offset, this.limit + this.offset);
    },
  },
};
</script>

<style scoped>
  .pagination {
    display: flex;
    margin: .25rem .25rem 0;
  }
  .pagination button {
    flex-grow: 1;
  }
  .pagination button:hover {
    cursor: pointer;
  }
</style>
