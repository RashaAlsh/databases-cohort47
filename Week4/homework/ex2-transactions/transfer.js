const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
const dbName = 'databaseWeek4';

async function transferMoney(fromAccountNumber, toAccountNumber, amount) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');
        const sourceAccount = await accountsCollection.findOne({ account_number: fromAccountNumber });
        const destinationAccount = await accountsCollection.findOne({ account_number: toAccountNumber });
        if (!sourceAccount || !destinationAccount) {
            throw new Error('Source or destination account not found.');
        }
        if (sourceAccount.balance < amount) {
            throw new Error('Insufficient balance in the source account.');
        }
        const newSourceBalance = sourceAccount.balance - amount;
        const newDestinationBalance = destinationAccount.balance + amount;
        await accountsCollection.updateOne(
            { account_number: fromAccountNumber },
            {
                $set: {
                    balance: newSourceBalance,
                },
                $push: {
                    account_changes: {
                        change_number: new ObjectId(),
                        amount: -amount,
                        changed_date: new Date(),
                        remark: `Transfer ${amount} to account ${toAccountNumber}`
                    }
                }
            }
        );

        await accountsCollection.updateOne(
            { account_number: toAccountNumber },
            {
                $set: {
                    balance: newDestinationBalance,
                },
                $push: {
                    account_changes: {
                        change_number: new ObjectId(),
                        amount: amount,
                        changed_date: new Date(),
                        remark: `Transfer ${amount} from account ${fromAccountNumber}`
                    }
                }
            }
        );
        console.log('Money transfer successful.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = transferMoney;