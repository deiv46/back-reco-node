const { MongoClient } = require('mongodb');
const config = require('../config/config.js');

const url = config.mongoURL;
const dbName = config.dbName;

const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

async function connectToDatabase() {
  await client.connect();
  const db = client.db(dbName);
  return db;
}

// Cierre de la conexión a la base de datos
async function closeDatabaseConnection() {
  await client.close();
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
};