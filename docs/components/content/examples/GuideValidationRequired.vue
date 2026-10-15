<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { books } from '~/assets/static/data'

const selected = ref(null)
const submitted = ref(false)
</script>

<template>
  <form @submit.prevent="submitted = true">
    <label for="guide-book">Book</label>
    <div class="row">
      <VueSelect
        v-model="selected"
        class="grow"
        label="title"
        :options="books"
        :input-attrs="{ id: 'guide-book', required: !selected }"
        @update:model-value="submitted = false"
      />
      <button type="submit">Submit</button>
    </div>
    <p v-if="submitted" class="success">Submitted {{ selected.title }}!</p>
  </form>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}
.row {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}
.grow {
  flex: 1;
}
button {
  padding: 0 1rem;
  border-radius: 4px;
  background: #15803d;
  color: #fff;
}
.success {
  margin: 0.5rem 0 0;
  color: #15803d;
}
</style>
