const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'transactions',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

function insertValues() {

  const account = [
    [101, 5000.00],
    [102, 10000.00],
    [103, 70500.00]
  ]; 
  
  const accountChanges = [
    [101, 1000.00, '2024-03-05', 'Deposit'],
    [102, -500.00, '2024-03-06', 'Withdrawal'],
    [103, 200.00, '2024-03-07', 'Deposit']
  ];

  try {
   
    connection.query('INSERT INTO account (account_number, balance) VALUES ?', [account], (err, results) => {
      if (err) throw err;
      console.log('Account data inserted');
    });

    connection.query('INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES ?', [accountChanges], (err, results) => {
      if (err) throw err;
      console.log('Account changes inserted');
    });

  } catch (error) {
    console.error(error);
    
  } finally {
    connection.end();
    console.log('connection closed');
  }
};

insertValues();