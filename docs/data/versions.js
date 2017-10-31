import md from '../md';

const versionInfo = {
  version: 'v1.x',
  versions: Object.keys(md),
}

versionInfo.getActiveDocs  = function() {
  return md[versionInfo.version]
}

export default versionInfo