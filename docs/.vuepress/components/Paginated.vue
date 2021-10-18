<template>
  <v-select
    :options="paginated"
    :filterable="false"
    @search="(query) => (search = query)"
  >
    <li slot="list-footer" class="pagination">
      <button :disabled="!hasPrevPage" @click="offset -= 10">Prev</button>
      <button :disabled="!hasNextPage" @click="offset += 10">Next</button>
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
      return this.countries.filter((country) => country.includes(this.search))
    },
    paginated() {
      return this.filtered.slice(this.offset, this.limit + this.offset)
    },
    hasNextPage() {
      const nextOffset = this.offset + 10
      return Boolean(
        this.filtered.slice(nextOffset, this.limit + nextOffset).length
      )
    },
    hasPrevPage() {
      const prevOffset = this.offset - 10
      return Boolean(
        this.filtered.slice(prevOffset, this.limit + prevOffset).length
      )
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
