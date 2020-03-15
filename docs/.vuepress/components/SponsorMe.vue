<template>
  <div class="sponsor-me">
    <div class="avatar">
      <a href="https://github.com/sponsors/sagalbot">
        <img
          src="https://avatars2.githubusercontent.com/u/692538?s=400&u=a5ab0d164266bd2d59ce1a514835627b4cc4f24f&v=4"
          alt="Jeff Sagal's Avatar"
        />
      </a>
    </div>
    <div class="cta">
      <p style="font-size: 1.2rem; font-weight: 600;">
        Hi! I'm Jeff Sagal, the author of Vue Select.
      </p>
      <p>
        I've spent hundreds of hours working alongside contributors to make Vue
        Select the best it can be. I've researched UX and accessibility
        patterns, squashed bugs, reviewed code, tested-cross browser, and spent
        many evenings and weekends working on these docs.
      </p>
      <p>
        If it's saved you time on your projects, please consider supporting me
        on GitHub sponsors.
      </p>
      <div class="links">
        <a
          href="https://github.com/sponsors/sagalbot"
          class="button"
          target="_blank"
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M10 0a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 01.1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0010 0"
            />
          </svg>
          Sponsor Vue Select!
        </a>
        <a href="https://twitter.com/sagalbot" target="_blank" class="social-link">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"
            />
          </svg>
          Follow @sagalbot
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sponsor-me {
  display: flex;
  border: 2px solid #c3dafe;
  background: #ebf4ff;
  border-radius: 10px;
  /*align-items: top;*/
  padding: 2rem 1rem;
  margin: 3rem 0;
  flex-direction: column;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem;
}
.cta {
  /*text-align: center;*/
}
@media (min-width: 1150px) {
  .sponsor-me {
    flex-direction: row;
  }
  .avatar {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin: 0 2rem;
  }
  .cta {
    text-align: left;
  }
}
p {
  margin-top: 0;
}
.avatar img {
  max-width: 150px;
  border-radius: 100%;
}
.button {
  display: inline-flex;
  text-align: center;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #63b3ed;
  color: #fff;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 0.5rem;
  transition: background-color 0.25s, box-shadow 0.25s;
}
.button svg {
  max-width: 25px;
  fill: currentColor;
  margin-right: 0.5rem;
}
a.button:hover {
  box-shadow: inset 0px 0px 3px #3182ce;
  background: #90cdf4;
  text-decoration: none;
  text-shadow: 0 1px 1px #63b3ed;
}
.links {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.links a {
  margin: 1rem;
}
@media (min-width: 1150px) {
  .links {
    flex-direction: row;
    justify-content: flex-start;
  }
  .links a {
    margin: 0 2rem 0 0;
  }
}
.social-link {
  display: flex;
  align-items: center;
  color: #3182ce;
}
.social-link svg {
  fill: currentColor;
  width: 20px;
  margin-right: 0.5rem;
}
.social-link:hover {
  color: #2c5282;
  text-decoration: none;
}
</style>
