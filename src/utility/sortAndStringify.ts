/**
 * Serialize an object with its top-level keys sorted, so objects
 * with the same keys in a different order serialize identically.
 */
function sortAndStringify(sortable: Record<string, unknown>): string {
  const ordered: Record<string, unknown> = {}

  Object.keys(sortable)
    .sort()
    .forEach((key) => {
      ordered[key] = sortable[key]
    })

  return JSON.stringify(ordered)
}

export default sortAndStringify
