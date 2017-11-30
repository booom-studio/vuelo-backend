
const config = require('config');
const { MongoClient } = require('mongodb');

const dbUrl = config.get('dbUrl');

module.exports = async () => {
  const db = await MongoClient.connect(dbUrl);
  return {
    Users: db.collection('users')
  };
};
