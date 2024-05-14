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

connection.query(`
    SELECT rp.paper_title, COUNT(ap.author_id) AS total_authors FROM research_papers rp 
    JOIN author_papers ap ON rp.paper_id = ap.paper_id 
    GROUP BY rp.paper_title
  `, 
  (err, results) => {
    if (err) throw err;
  console.log('All research papers and the number of authors that wrote that paper:', results);
});

connection.query(`
    SELECT COUNT(*) AS total_papers FROM authors a 
    JOIN author_papers ap ON a.author_id = ap.author_id 
    WHERE a.gender = 'female';
  `, 
  (err, results) => {
    if (err) throw err;
  console.log('Sum of the research papers published by all female authors:', results);
});

// passed average inside ROUND to ignore the decimals - otherwise i get like 10.0000 or 21.0000
connection.query(`
    SELECT university, ROUND(AVG(h_index)) AS average_h_index FROM authors 
    GROUP BY university
  `, 
  (err, results) => {
    if (err) throw err;
  console.log('Average of the h-index of all authors per university:', results);
});

connection.query(`
    SELECT a.university, COUNT(ap.paper_id) AS total_papers FROM authors a 
    JOIN author_papers ap ON a.author_id = ap.author_id 
    GROUP BY a.university
  `, 
  (err, results) => {
    if (err) throw err;
  console.log('Sum of the research papers of the authors per university:', results);
});

connection.query(`
    SELECT university, 
    MAX(h_index) AS max, MIN(h_index) AS min FROM authors 
    GROUP BY university
  `, 
  (err, results) => {
    if (err) throw err;
  console.log('Minimum and maximum of the h-index of all authors per university:', results);
});

connection.end();