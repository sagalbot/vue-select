export interface Sponsor {
  login: string
  name: string | null
  avatarUrl: string
  url: string
  since: string
  isActive: boolean
}

export interface Contributor {
  login: string
  avatarUrl: string
  url: string
  contributions: number
}

const REPO = 'sagalbot/vue-select'
const MAINTAINER = 'sagalbot'

// GITHUB_TOKEN in CI and on Netlify; GH_TOKEN where the gh CLI is set up.
const token = () => process.env.GITHUB_TOKEN || process.env.GH_TOKEN

/**
 * Public sponsorships of the maintainer, current and past. Private sponsorships are
 * never listed. Needs a token; without one the list is empty.
 */
export async function fetchSponsors(): Promise<Sponsor[]> {
  if (!token()) {
    console.warn('[sponsors] GITHUB_TOKEN is not set; the sponsor list will be empty.')
    return []
  }

  const query = `{
    user(login: "${MAINTAINER}") {
      sponsorshipsAsMaintainer(first: 100, activeOnly: false, includePrivate: false) {
        nodes {
          isActive
          createdAt
          sponsorEntity {
            ... on User { login name avatarUrl url }
            ... on Organization { login name avatarUrl url }
          }
        }
      }
    }
  }`

  try {
    const { data } = await $fetch<{ data: any }>('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `bearer ${token()}` },
      body: { query },
    })
    return (data?.user?.sponsorshipsAsMaintainer?.nodes ?? [])
      .filter((node: any) => node.sponsorEntity?.login)
      .map((node: any) => ({
        ...node.sponsorEntity,
        since: node.createdAt,
        isActive: node.isActive,
      }))
      .sort((a: Sponsor, b: Sponsor) => a.since.localeCompare(b.since))
  } catch (error) {
    console.warn(`[sponsors] Couldn't fetch sponsors: ${error}`)
    return []
  }
}

/** Everyone with commits in the repository, most contributions first, without bots. */
export async function fetchContributors(): Promise<Contributor[]> {
  const contributors: Contributor[] = []
  try {
    for (let page = 1; page <= 5; page++) {
      const batch = await $fetch<any[]>(`https://api.github.com/repos/${REPO}/contributors`, {
        query: { per_page: 100, page },
        headers: token() ? { authorization: `bearer ${token()}` } : {},
      })
      contributors.push(
        ...batch
          .filter((c) => c.type === 'User' && c.login !== 'semantic-release-bot')
          .map((c) => ({
            login: c.login,
            avatarUrl: c.avatar_url,
            url: c.html_url,
            contributions: c.contributions,
          })),
      )
      if (batch.length < 100) break
    }
  } catch (error) {
    console.warn(`[contributors] Couldn't fetch contributors: ${error}`)
  }
  return contributors
}
