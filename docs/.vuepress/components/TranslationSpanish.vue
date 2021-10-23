<template>
  <SpanishSelect :options="['uno', 'dos', 'tres', 'cuatro']" />
</template>

<script>
import SpanishSelect from 'vue-select'
import { locale as spanish } from 'vue-select/locales/es.js'

SpanishSelect.props.locale = {
  type: Function,
  default: () => spanish,
}

export default {
  components: { SpanishSelect },
}
</script>
