const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'transactions',
});

const execQuery = util.promisify(connection.query.bind(connection));

async function coreDatabase() {
  connection.connect();

  try {

    await execQuery('START TRANSACTION');

    await execQuery('UPDATE account SET balance = balance - 1000 WHERE account_number = 101');
    await execQuery('UPDATE account SET balance = balance + 1000 WHERE account_number = 102');

    await execQuery("INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (101, -1000, '2024-03-05', 'Withdrawal')");
    await execQuery("INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (102, 1000, '2024-03-05', 'Deposit')");

    await execQuery('COMMIT');

  } catch (error) {
    console.error(error);

    await execQuery('ROLLBACK');

  } finally {
    connection.end();
    console.log('connection closed');
  }
};

coreDatabase();