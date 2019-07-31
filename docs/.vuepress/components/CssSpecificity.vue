<template>
  <div>
    <v-select
      class="style-chooser"
      placeholder="Choose a Styling Option"
      :options="['Components', 'CSS / Variables', 'Slots']"
    />
  </div>
</template>

<style>
  .style-chooser .vs__search::placeholder,
  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    background: #dfe5fb;
    border: none;
    color: #394066;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .style-chooser .vs__clear,
  .style-chooser .vs__open-indicator {
    fill: #394066;
  }
</style>
