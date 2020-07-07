<template>
  <ParentLayout>
    <EthicalAds slot="sidebar-top" />
  </ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";
import EthicalAds from "../components/EthicalAds.vue";

export default {
  components: {
    ParentLayout,
    EthicalAds
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
