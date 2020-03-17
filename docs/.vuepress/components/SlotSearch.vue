<template>
  <v-select>
    <template #search="{ attributes, events }">
      <input
        maxlength="1"
        class="vs__search"
        v-bind="attributes"
        v-on="events"
      >
    </template>
  </v-select>
</template>
