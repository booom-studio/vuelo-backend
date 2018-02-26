module.exports = {
  dbUrl: process.env.MONGODB_URI,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
  }
};
