export interface DocsVersion {
  /** Short name shown in the version switcher, e.g. "v4". */
  id: string
  /** Route prefix the version's pages live under ('' for the latest version). */
  prefix: string
  /** The Vue Select release line these docs describe. */
  release: string
  /** The Vue major version the release line supports. */
  vue: string
  latest?: boolean
}

/**
 * Every version of the docs, newest first. The latest version lives at the
 * site root; older versions are archived under their prefix, with their
 * content in `content/<id>/`.
 */
export const versions: DocsVersion[] = [
  { id: 'v4', prefix: '', release: '4.x', vue: 'Vue 3', latest: true },
  { id: 'v3', prefix: '/v3', release: '3.x', vue: 'Vue 2' },
]

export const latestVersion = versions.find((v) => v.latest)!

export function versionForPath(path: string): DocsVersion {
  return (
    versions.find(
      (v) => v.prefix && (path === v.prefix || path.startsWith(`${v.prefix}/`)),
    ) ?? latestVersion
  )
}

/** The path of a page relative to its version, e.g. /v3/api/props -> /api/props. */
export function unversionedPath(path: string): string {
  const { prefix } = versionForPath(path)
  return path.slice(prefix.length) || '/'
}
