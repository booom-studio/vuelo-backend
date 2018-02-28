const config = require('config');
const { MongoClient } = require('mongodb');

const colors = require('./colors');

const dbUrl = config.get('dbUrl');
const colorsKey = config.get('colorsConfigKey');

const connect = async () => {
  console.log('Seeding config..');

  const db = await MongoClient.connect(dbUrl);

  const Config = db.collection('config');

  const hasColors = await Config.count({ key: colorsKey });

  if (!hasColors) {
    console.log('Seeding colors..');
    await Config.insertOne({ key: colorsKey, colors });
  }

  console.log('Done.');
};

connect().then(process.exit);
