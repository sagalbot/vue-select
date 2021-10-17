<template>
  <table>
    <tr>
      <th>Name</th>
      <th>Country</th>
    </tr>
    <tr v-for="person in people">
      <td>{{ person.name }}</td>
      <td>
        <v-select
          :options="options"
          :value="person.country"
          @input="(country) => updateCountry(person, country)"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import countries from '../data/countries'

export default {
  data: () => ({
    people: [
      { name: 'John', country: '' },
      { name: 'Jane', country: '' },
    ],
  }),
  computed: {
    options: () => countries,
  },
  methods: {
    updateCountry(person, country) {
      person.country = country
    },
  },
}
</script>

<style scoped>
table {
  display: table;
  width: 100%;
}
</style>
