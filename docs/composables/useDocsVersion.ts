/** The docs version of the current route, and its sidebar. */
export function useDocsVersion() {
  const route = useRoute()
  const path = computed(() => route.path.replace(/\/+$/, '') || '/')
  const version = computed(() => versionForPath(path.value))
  const navigation = computed(() => navigationFor(version.value))
  return { path, version, navigation }
}
