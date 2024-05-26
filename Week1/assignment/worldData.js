const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connection successful!');
});

const worldQuery = fs.readFileSync('../world.sql', 'utf8'); // reading world.sql file

const queries = [
  worldQuery,
  "SELECT Name FROM country WHERE Population >= 8000000;",
  "SELECT Name FROM country WHERE Name LIKE '%land%';",
  "SELECT Name FROM city WHERE Population BETWEEN 500000 AND 1000000;",
  "SELECT Name FROM country WHERE Continent = 'Europe';",
  "SELECT Name FROM country ORDER BY SurfaceArea DESC;",
  "SELECT Name FROM city WHERE CountryCode = 'NLD';",
  "SELECT Population FROM city WHERE Name = 'Rotterdam';",
  "SELECT Name FROM country ORDER BY SurfaceArea DESC LIMIT 10;",
  "SELECT Name FROM city ORDER BY Population DESC LIMIT 10;",
  "SELECT SUM(Population) FROM country;"
];

function executeQueries(queries) {
  queries.forEach(query => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error(`Error ${err.message}`);
        return;
      }
      console.log(`Results for: ${query}`, results);
    });
  });
  
  connection.end();  
};

executeQueries(queries);