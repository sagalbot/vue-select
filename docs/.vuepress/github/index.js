const clientDynamicModules = require('./clientDynamicModules');

module.exports = {
  clientDynamicModules: async () => await clientDynamicModules(),
};
