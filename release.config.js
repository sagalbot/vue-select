module.exports = {
  branches: ['master', { name: 'next', prerelease: true }],
  plugins: [
    '@semantic-release/npm',
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        assets: ['dist/**'],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json'],
        message: 'chore(🚀): ${nextRelease.version}',
      },
    ],
  ],
}
