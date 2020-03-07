<template>
  <v-select>
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        No results found for <em>{{ search }}</em>.
      </template>
      <em style="opacity: 0.5;" v-else>Start typing to search for a country.</em>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'BetterNoOptions',
};
</script>
