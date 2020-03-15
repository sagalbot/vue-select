const axios = require("axios");

module.exports = async () => {
  const { data } = await axios.get(
    "https://api.github.com/repos/sagalbot/vue-select/contributors?per_page=100"
  );

  return {
    name: "constants.js",
    content: `export const CONTRIBUTORS = ${JSON.stringify(data)}`
  };
};
