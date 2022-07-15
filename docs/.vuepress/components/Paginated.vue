<template>
  <v-select :options="paginated" :filterable="false" @search="onSearch">
    <li slot="list-footer" class="pagination">
      <button :disabled="!hasPrevPage" @click="offset -= limit">Prev</button>
      <button :disabled="!hasNextPage" @click="offset += limit">Next</button>
    </li>
  </v-select>
</template>

<script>
import countries from '../data/countries'
export default {
  data: () => ({
    countries,
    search: '',
    offset: 0,
    limit: 10,
  }),
  computed: {
    filtered() {
      return this.countries.filter((country) =>
        country.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
      )
    },
    paginated() {
      return this.filtered.slice(this.offset, this.limit + this.offset)
    },
    hasNextPage() {
      const nextOffset = this.offset + this.limit
      return Boolean(
        this.filtered.slice(nextOffset, this.limit + nextOffset).length
      )
    },
    hasPrevPage() {
      const prevOffset = this.offset - this.limit
      return Boolean(
        this.filtered.slice(prevOffset, this.limit + prevOffset).length
      )
    },
  },
  methods: {
    onSearch(query) {
      this.search = query
      this.offset = 0
    },
  },
}
</script>

<style scoped>
.pagination {
  display: flex;
  margin: 0.25rem 0.25rem 0;
}
.pagination button {
  flex-grow: 1;
}
.pagination button:hover {
  cursor: pointer;
}
</style>
