<template>
  <v-select
    :dropdown-option-wrap="wrap"
    :options="[
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Mauris molestie, orci non dapibus interdum, sapien velit gravida ex, vel rutrum purus augue tempor ligula.',
      'Cras et felis in massa maximus tempor. Praesent malesuada enim eget sollicitudin luctus. Praesent ullamcorper euismod nisi, vel volutpat diam volutpat eu.',
      'Nunc suscipit laoreet nunc. Donec rhoncus blandit nibh et auctor. Mauris euismod erat non gravida egestas.',
    ]"
  />
</template>

<script>
export default {
  name: 'OptionWrapStrategy',
  props: ['wrap'],
}
</script>
