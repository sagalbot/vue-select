<template>
  <ul>
    <li v-for="{ createdAt, login, avatarUrl } in sponsors" :key="login">
      <img :src="avatarUrl + '&s=150'" :alt="`@${login}'s avatar`" />
      <p>
        <a :href="`https://github.com/${login}`">@{{ login }}</a> <br />
        Sponsor since {{ createdAt }}
      </p>
    </li>
  </ul>
</template>

<script>
import { SPONSORS } from '@dynamic/constants'
import { format } from 'date-fns'

export default {
  data: () => ({
    sponsors: SPONSORS.map(({ createdAt, sponsorEntity }) => ({
      createdAt: format(new Date(createdAt), 'LLL yyyy'),
      ...sponsorEntity,
    })),
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
  /*max-width: 220px;*/
}
a {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
