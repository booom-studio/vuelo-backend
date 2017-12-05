const config = require('config');
const GoogleAuth = require('google-auth-library');

module.exports = () => {
  const googleClientId = config.get('google.clientId');
  
  const auth = new GoogleAuth();
  const authClient = new auth.OAuth2(googleClientId, '', '');

  return Object.freeze({
    verify(token) {
      return new Promise((resolve, reject) => {
        authClient.verifyIdToken(token, googleClientId, (error, user) => {
          if(error)
            return reject(error);

          return resolve(user.getPayload());
        });
      });
    }
  });
};

