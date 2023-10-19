const { MongoClient } = require('mongodb');
const config = require('../config/config.js');

const url = config.mongoURL;
const dbName = config.dbName;

const client = new MongoClient(url, { useUnifiedTopology: true });

async function connectToDatabase() {
  await client.connect();
  const db = client.db(dbName);
  return db;
}

module.exports = {
  connectToDatabase,
};