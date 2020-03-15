<template>
  <ul>
    <li v-for="c in contributors">
      <img :src="`${c.avatar_url}&s=75`" :alt="`${c.login}'s Avatar`" />
      <div>
        <a :href="c.html_url">@{{ c.login }}</a>
        <br>{{ c.contributions }} contributions
      </div>
    </li>
  </ul>
</template>

<script>
import { CONTRIBUTORS } from "@dynamic/constants";

export default {
  data: () => ({
    contributors: CONTRIBUTORS.filter(
      ({ login }) => login !== "semantic-release-bot"
    )
  })
};
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
  /*max-width: 220px;*/
}
  a {
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
</style>
