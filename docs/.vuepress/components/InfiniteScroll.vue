<template>
  <v-select :options="countries" @open="onOpen" @close="onClose">
    <template #list-footer v-if="hasNextPage">
      <li ref="load">Loading more options...</li>
    </template>
  </v-select>
</template>

<script>
import vSelect from '../../../src/components/Select'
import countries from '../data/countries';

export default {
  components: {vSelect},
  name: "InfiniteScroll",
  data: () => ({observer: null, limit: 10}),
  computed: {
    countries () {
      return countries.slice(0, this.limit);
    },
    hasNextPage () {
      return this.countries.length < countries.length;
    },
  },
  mounted () {
    this.observer = new IntersectionObserver(this.infiniteScroll, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    });
  },
  methods: {
    async onOpen () {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load)
      }
    },
    onClose () {
      this.observer.disconnect();
    },
    async infiniteScroll ([{isIntersecting, target}]) {
      if (isIntersecting) {
        const scrollTop = target.offsetParent.scrollTop;
        this.limit += 10;
        await this.$nextTick();
        target.offsetParent.scrollTop = scrollTop;
      }
    }
  }
}
</script>

<style scoped>

</style>
