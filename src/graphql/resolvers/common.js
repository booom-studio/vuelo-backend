const config = require('config');

module.exports = {
  // Queries
  async colors(root, data, { mongo: { Config } }) {
    const { colors } = await Config.findOne({
      key: config.get('colorsConfigKey')
    });

    return JSON.stringify(colors);
  }
};
