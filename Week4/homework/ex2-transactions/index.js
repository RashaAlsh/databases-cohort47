const createAccounts = require('./setup');
const transferMoney = require('./transfer');

async function main() {
    await createAccounts();
    await transferMoney(101, 102, 1000);
}

main()