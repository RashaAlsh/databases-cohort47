const { MongoClient } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
const dbName = 'databaseWeek4';

async function createCountriesDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        await dropCollectionIfExists(db, 'countries');
        await insertPopulationData(db, 'population_pyramid_1950-2022.csv');
        console.log('Data insertion complete');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

async function dropCollectionIfExists(db, collectionName) {
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
        await db.collection(collectionName).drop();
        console.log(`Dropped collection: ${collectionName}`);
    }
}

async function insertPopulationData(db, fileName) {
    const collectionName = 'countries';
    const collection = db.collection(collectionName);
    const data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(fileName)
            .pipe(csv())
            .on('data', (row) => {
                data.push({
                    Country: row.Country,
                    Year: parseInt(row.Year),
                    Age: row.Age,
                    M: parseInt(row.M),
                    F: parseInt(row.F)
                });
            })
            .on('end', async () => {
                try {
                    await collection.insertMany(data);
                    console.log(`Inserted ${data.length} documents into collection: ${collectionName}`);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

createCountriesDatabase();