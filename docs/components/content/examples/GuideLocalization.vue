<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(['Canada'])

const ariaLabels = {
  toggle: 'Afficher les options',
  search: 'Rechercher un pays',
  clear: 'Effacer la sélection',
  deselect: (label) => `Retirer ${label}`,
}
</script>

<template>
  <VueSelect
    v-model="selected"
    multiple
    placeholder="Choisissez un pays"
    :options="['Canada', 'France', 'Belgique', 'Suisse']"
    :aria-labels="ariaLabels"
  >
    <template #no-options>Désolé, aucune option ne correspond.</template>
    <template #spinner="{ loading }">
      <div v-show="loading" class="vs__spinner">Chargement…</div>
    </template>
  </VueSelect>
</template>
