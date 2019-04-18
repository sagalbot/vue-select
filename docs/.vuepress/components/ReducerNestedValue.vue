<template>
  <div class="flex">
    <div>
      <v-select
              label="country"
              v-model="selected"
              :reduce="opt => opt.meta.id"
              :options="options"
      />
    </div>
    <div>
      <pre><code>v-model value: {{ selected || 'null' }}</code></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReducerNestedValue',
  data: () => ({
    selected: null,
    options: [
      {
        country: 'canada',
        meta: {
          id: '1',
          code: 'ca',
        },
      }],
  }),
};
</script>

<style scoped>
  .flex {
    margin-bottom: 2rem;
    border: 1px solid #eaecef;
    /*padding: 1rem;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex > div {
    flex-grow: 1;
    width: 50%;
    padding: 0 1rem;
  }

  pre {
    margin: 0;
    background: #fff;
  }

  code {
    color: #635762 !important;
    color: #5b2d2d !important;
    /*color: #7ec699 !important;*/
  }
</style>
