<template>
  <ParentLayout>
    <CodeFund slot="sidebar-top"/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CodeFund from '../components/CodeFund.vue'

export default {
  components: {
    ParentLayout,
    CodeFund
  }
}
</script>

<style>
  #codefund {
    border-bottom: 1px solid #eaecef;
    min-height: 115px;
  }
  #codefund + .sidebar-links {
    padding-top: 1rem;
  }
</style>
