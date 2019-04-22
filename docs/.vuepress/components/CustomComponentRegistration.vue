<template>
  <custom-select :options="['Vue.js', 'React', 'Angular']" />
</template>

<script>
import Vue from 'vue';
import vSelect from '../../../src/components/Select';

const components = {
  Deselect: Vue.component('Deselect', {
    render: (createElement) => createElement('button', '❌'),
  }),
  OpenIndicator: Vue.component('OpenIndicator', {
    render: (createElement) => createElement('span', '🔽'),
  }),
};

const mySelect = {...vSelect};

mySelect.props.components.default = () => components;

export default {
  components: {'custom-select': mySelect}
}
</script>
