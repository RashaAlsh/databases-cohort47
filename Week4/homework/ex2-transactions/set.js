const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
const dbName = 'databaseWeek4';

async function createAccounts() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        await dropCollectionIfExists(db, 'accounts');
        await createAndInsertAccounts(db);
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

async function createAndInsertAccounts(db) {
    const accountsCollection = db.collection('accounts');
    const accountsData = [
        {
            account_number: 101,
            balance: 5000.00,
            account_changes: [
                { change_number: new ObjectId(), amount: 5000.00, changed_date: new Date(), remark: 'Initial deposit' }
            ]
        },
        {
            account_number: 102,
            balance: 3000.00,
            account_changes: [
                { change_number: new ObjectId(), amount: 3000.00, changed_date: new Date(), remark: 'Initial deposit' }
            ]
        }
    ];
    await accountsCollection.insertMany(accountsData);
}

module.exports = createAccounts;