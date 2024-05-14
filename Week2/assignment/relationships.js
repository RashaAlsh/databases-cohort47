const mysql = require('mysql');
const { authors, papers, authorPapers } = require('./data.js');

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

const createQuery = (query) => {
  connection.query(query , (err, results) => {
    if (err) throw err;
    console.log('Execution complete', results);
  });
};

createQuery(`
  CREATE TABLE IF NOT EXISTS research_papers (
    paper_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    paper_title VARCHAR(255) NOT NULL,
    conference VARCHAR(255),
    publish_date DATE
  );`
);

createQuery(`
  CREATE TABLE IF NOT EXISTS author_papers (
    author_id INT,
    paper_id INT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id),
    FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id),
    PRIMARY KEY (author_id),
    UNIQUE (author_id, paper_id)
  );`
);

// temporarily turns off checks for foreign keys - https://www.sqlines.com/mysql/set_foreign_key_checks
createQuery('SET FOREIGN_KEY_CHECKS=0')

connection.query('INSERT INTO authors (author_name, university, date_of_birth, h_index, gender, mentor) VALUES ?', [authors], (err, results) => {
  if (err) throw err;
  console.log('Author data inserted');
});

connection.query('INSERT INTO research_papers (paper_title, conference, publish_date) VALUES ?', [papers], (err, results) => {
  if (err) throw err;
  console.log('Paper data inserted');
});

// turns on foreign keys checks
createQuery('SET FOREIGN_KEY_CHECKS=1')

connection.query('INSERT IGNORE INTO author_papers (author_id, paper_id) VALUES ?', [authorPapers], (err, results) => {
  if (err) throw err;
  console.log('Author papers inserted');
});

connection.end();