<template>
  <v-select :loading="true">
    <template #spinner="{ loading }">
      <div
        v-if="loading"
        style="border-left-color: rgba(88, 151, 251, 0.71)"
        class="vs__spinner"
      >
        The .vs__spinner class will hide the text for me.
      </div>
    </template>
  </v-select>
</template>
