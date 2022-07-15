<template>
  <div>
    <v-select
      :options="['Canada', 'United States']"
      :components="{ OpenIndicator }"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    OpenIndicator: {
      render: (createElement) => createElement('span', '🔽'),
    },
  }),
}
</script>
