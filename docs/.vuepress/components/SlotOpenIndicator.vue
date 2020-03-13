<template>
  <v-select>
    <template #open-indicator="{ attributes }">
      <span v-bind="attributes">🔽</span>
    </template>
  </v-select>
</template>
