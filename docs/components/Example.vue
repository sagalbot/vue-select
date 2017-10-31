<template>
    <div class="row" v-if="exists">
        <div class="col-md-7">
            <div ref="markdown">
                <markdown :name="md"/>
                <slot name="afterMarkdown" :selection="selection"></slot>
            </div>
        </div>
        <div class="col-md-5" :style="{minHeight: markdownHeight}">
            <div ref="exampleComponent" class="example-component">
                <slot :selection="selection"/>
            </div>
        </div>
    </div>
    <div v-else></div>
</template>

<script>
  import Markdown from './Markdown.vue'
  import versionInfo from '../data/versions'

  export default {
    components: {Markdown},
    name: 'Example',
    props: {
      md: {
        type: String,
        required: true,
      },

      initial: null,
    },

    data () {
      return {
        markdownHeight: null,
        selection: this.initial,
      }
    },

    computed: {
      exists () {
        return versionInfo.getActiveDocs().hasOwnProperty(this.md)
      },
    },

    mounted () {
      const height = this.$refs.markdown.getBoundingClientRect().height
      this.markdownHeight = height > 0 ? height + 'px' : null
    }
  }
</script>

<style scoped>
    .col-md-5 {
        position: relative;
    }
    .example-component {
        position: absolute;
        bottom: 0;
        width: 100%;
    }
</style>