const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});

const execQuery = util.promisify(connection.query.bind(connection));

function coreDatabase() {

  const CREATE_ACCOUNT_TABLE = `
    CREATE TABLE IF NOT EXISTS account (
      account_number INT PRIMARY KEY,
      balance DECIMAL(10, 2)
  );`

  const CREATE_ACCOUNT_CHANGES_TABLE = `
    CREATE TABLE IF NOT EXISTS account_changes (
      change_number INT AUTO_INCREMENT PRIMARY KEY,
      account_number INT,
      amount DECIMAL(10, 2),
      changed_date DATE,
      remark VARCHAR(255),
      FOREIGN KEY (account_number) REFERENCES account(account_number)
  );`

  connection.connect();

  try {

    execQuery('DROP DATABASE IF EXISTS transactions');
    execQuery('CREATE DATABASE IF NOT EXISTS transactions');
    execQuery('USE transactions');

    execQuery(CREATE_ACCOUNT_TABLE);
    execQuery(CREATE_ACCOUNT_CHANGES_TABLE);

  } catch (error) {
    console.error(error);
    
  } finally {
    connection.end();
    console.log('connection closed');
  }
};

coreDatabase();