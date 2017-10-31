<template>
    <ul class="nav nav-pills nav-stacked">
        <li v-for="(value, key, index) in nav">
            <a :href="'#'+value.id">{{ value.title }}</a>
            <ul v-if="value.children">
                <li v-for="(value, key, index) in value.children">
                    <a :href="'#'+value.id">{{ value.title }}</a>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
  import {buildNavigation} from '../data/navigation'
  import versionInfo from '../data/versions'

  export default {
    data () {
      return {
        nav: [],
      }
    },

    methods: {
      linkFor (value) {
        console.log(value)
        if (!value) {
          return null;
        }
        return '#' + value.toLowerCase()
      }
    },

    computed: {
      version() {
        return versionInfo.version
      }
    },

    watch: {
      version() {
        this.$nextTick(() => this.nav = buildNavigation(this.$parent.$el))
      }
    },

    mounted() {
      this.$nextTick(() => this.nav = buildNavigation(this.$parent.$el))
    }
  }
</script>
