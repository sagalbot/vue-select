<template>
  <ParentLayout></ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";

export default {
  components: {
    ParentLayout,
  }
};
</script>

<style>
#ads {
  border-bottom: 1px solid #eaecef;
}
#ads + .sidebar-links {
  padding-top: 1rem;
}
</style>
