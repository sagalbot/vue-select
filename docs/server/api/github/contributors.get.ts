// Fetched while prerendering, so the generated site ships the list in its payload.
export default defineEventHandler(() => fetchContributors())
