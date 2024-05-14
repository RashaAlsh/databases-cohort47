const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'author_info',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    university VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    h_index INT NOT NULL,
    gender ENUM('female','male','non-binary', 'prefer not to say')
  )`;

connection.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Authors table created');      
});

connection.query(`
    ALTER TABLE authors 
    ADD COLUMN mentor INT, 
    ADD CONSTRAINT fk_mentor 
    FOREIGN KEY (mentor) REFERENCES authors(author_id)
  `, 
  (err, result) => {
    if (err) throw err;
  console.log('Mentor column added with foreign key constraint');
});  

connection.end();