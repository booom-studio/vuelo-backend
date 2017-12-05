const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = () => {
  const secret = config.get('jwtSecret');

  return Object.freeze({
    getToken: (data) => jwt.sign(data, secret, { expiresIn: '30m' }),
    verify: (token) => jwt.verify(token, secret)
  });
};