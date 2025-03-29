<template>
  <v-select v-model="selected" :options="countries" multiple append-to-body>
    <template #selected-option-container><i style="display: none;"></i></template>
    <template #search="{ events, attributes }">
      <input
        placeholder="Choose a country.."
        class="vs__search"
        type="search"
        v-on="events"
        v-bind="attributes"
      >
    </template>
    <template #footer="{ deselect }">
      <ul class="selected-options">
        <li v-for="country in selected">
          <button @click="deselect(country)">x</button>
          {{ country }}
        </li>
      </ul>
    </template>
  </v-select>
</template>

<script>
import countries from '../data/countries'

export default {
  data: () => ({
    countries,
    selected: []
  }),
}
</script>

<style scoped>
.selected-options {
  padding: 0;
  list-style: none;
}
</style>
