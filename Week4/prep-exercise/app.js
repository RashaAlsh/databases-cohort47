const { MongoClient } = require('mongodb');
const data = require('./data.js');
require('dotenv').config();

async function dropCollectionIfExists(db, collectionName) {
  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length > 0) {
    await db.collection(collectionName).drop();
    console.log(`Collection dropped: ${collectionName}`);
  }
}

async function createMultipleRecipes(client, dbName, collection, data) {
  const result = await client.db(dbName).collection(collection).insertMany(data);

  console.log(`${result.insertedCount} New recipes created with the following id(s):`);
  
  console.log(result.insertedIds);
}

async function main() {

  const collectionName = 'recipes';
  const db = 'recipeList';

  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }

  const client = new MongoClient(process.env.MONGODB_URL);

  try {

    await client.connect();
    console.log('Connected to database');

    const database = client.db(db);
    await dropCollectionIfExists(database, collectionName);

    await createMultipleRecipes(client, db, collectionName, data);

  } catch (error) {
    console.error(error);

  } finally{
    await client.close();
    console.log('Connection terminated');
  }
}

main().catch(console.error);