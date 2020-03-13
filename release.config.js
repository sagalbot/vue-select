module.exports = {
  release: {
    branch: "master"
  },
  plugins: [
    "@semantic-release/npm",
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: ["dist/**"],
        successComment:
          ":tada: This issue has been resolved in version ${nextRelease.version} :tada:\\n\\nThe release is available on [GitHub release](<github_release_url>)\\n\\nPlease consider [sponsoring Vue Select](https://github.com/sponsors/sagalbot), your support is much appreciated! :+1:"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message: "chore(🚀): ${nextRelease.version}"
      }
    ]
  ]
};
