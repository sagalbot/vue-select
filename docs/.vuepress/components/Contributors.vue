<template>
  <ul>
    <li
      v-for="{ login, avatar_url, html_url, contributions } in contributors"
      :key="login"
    >
      <img :src="`${avatar_url}&s=75`" :alt="`${login}'s Avatar`" />
      <div>
        <a :href="html_url">@{{ login }}</a>
        <br /><a
          class="contributions-link"
          :href="`https://github.com/sagalbot/vue-select/commits?author=${login}`"
          >{{ contributions }} contributions</a
        >
      </div>
    </li>
  </ul>
</template>

<script>
import { CONTRIBUTORS } from '@dynamic/constants'

export default {
  data: () => ({
    contributors: CONTRIBUTORS.filter(
      ({ login }) => login !== 'semantic-release-bot'
    ),
  }),
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  max-width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
img {
  width: 75px;
  height: 75px;
  margin-right: 1rem;
  border-radius: 100%;
}
li {
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  margin-right: 1rem;
}
a {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contributions-link {
  color: #2c5282;
}
</style>
