module.exports = {
  release: {
    branch: "master"
  },
  plugins: [
    "@semantic-release/npm",
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message: "chore(🚀): ${nextRelease.version}"
      }
    ]
  ]
};
