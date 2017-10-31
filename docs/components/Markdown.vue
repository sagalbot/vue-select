<template>
    <article v-html="html"></article>
</template>

<script>
    import docs from '../md';
    import versionInfo from '../data/versions'


    export default {
        name: 'Markdown',
        props: {
            name: {
                type: String,
                required: true,
            }
        },
        computed: {
            activeDocs() {
                return docs[versionInfo.version]
            },

            html() {
                return this.activeDocs[this.name]
            }
        }
    }
</script>