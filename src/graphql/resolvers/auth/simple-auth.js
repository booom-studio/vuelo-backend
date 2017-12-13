const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = () => {
  const { secret, expiresIn } = config.get('jwt');

  return Object.freeze({
    getToken: (data) => jwt.sign(data, secret, { expiresIn }),
    verifyToken(token) {
      const cleanToken = token.replace(/^Bearer\s*/, '');
      try {
        return jwt.verify(cleanToken, secret);
      } catch(err) {
        switch(err.name) {
          case 'TokenExpiredError':
            throw new Error('Token expired');
          case 'JsonWebTokenError':
          default:
            console.log({ cleanToken, token });
            throw new Error('Invalid token');
        }
      }
    }
  });
};
