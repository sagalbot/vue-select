require('dotenv').config()
const axios = require('axios')
const { graphql } = require('@octokit/graphql')

module.exports = async () => ({
  name: 'constants.js',
  content: `
      export const SPONSORS = ${JSON.stringify(await getSponsors())};
      export const CONTRIBUTORS = ${JSON.stringify(await getContributors())};
    `,
})

/**
 * Get a list of vue select contributors.
 * @return {Promise<T>}
 */
async function getContributors() {
  const { data } = await axios.get(
    'https://api.github.com/repos/sagalbot/vue-select/contributors?per_page=100'
  )

  return data
}

/**
 * Get a list of the current sponsors. Requires GITHUB_TOKEN to be set.
 * @return {Promise<*[]|ProfileNode[]|postcss.ChildNode[]|Array<parser.Node>|[]>}
 */
async function getSponsors() {
  /**
   * Deploy previews don't have access to secrets.
   * Return early since we don't have a token.
   */
  if (
    process.env['DEPLOY_PREVIEW'] &&
    parseInt(process.env['DEPLOY_PREVIEW'])
  ) {
    console.log('Skipping sponsors because this is a deploy preview.')
    return []
  }

  console.log('Fetching sponsors...')

  const query = `
    {
      user(login: "sagalbot") {
        sponsorshipsAsMaintainer(first: 100) {
          nodes {
            sponsorEntity {
              ... on User {
                id
                avatarUrl
                login
              }
              ... on Organization {
                id
                avatarUrl
                login
              }
            }
            createdAt
          }
        }
      }
    }
  `

  try {
    const { user } = await graphql(query, {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN || ''}`,
      },
    })
    return user.sponsorshipsAsMaintainer.nodes
  } catch (e) {
    console.log(`${e.status} ${e.name} - Couldn't fetch sponsor data.`)
    return []
  }
}
