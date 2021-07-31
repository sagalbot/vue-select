<template>
  <v-select :options="books" label="title" multiple>
    <template #selected-option-container="{ option, deselect, multiple, disabled }">
        <div class="vs__selected">
            {{ option.title }}
            <button v-if="multiple" :disabled="disabled" v-on:click="deselect(option)" type="button" class="vs__deselect" :title="`Deselect ${option.title}`" :aria-label="`Deselect ${option.title}`" ref="deselectButtons">
                X
            </button>
        </div>
    </template>
  </v-select>
</template>

<script>
export default {
  data: () => ({
    books: [
      {
        title: "Old Man's War",
        author: {
          firstName: "John",
          lastName: "Scalzi"
        }
      }
    ]
  })
}
</script>
