const config = require('config');

module.exports = {
  // Queries
  colors: () => JSON.stringify(config.get('colors'))
};
