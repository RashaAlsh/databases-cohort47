const util = require('util');
const mysql = require('mysql');
const { recipes, categories, ingredients, steps, recipeCategories,
  recipeIngredients, recipeSteps } = require('./date-recipes.js');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'recipes',
});

const executeQuery = util.promisify(connection.query.bind(connection));

async function coreDatabase(){

  const CREATE_RECIPES_TABLE = `
    CREATE TABLE IF NOT EXISTS Recipes (
      recipe_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      recipe_name VARCHAR(100) NOT NULL     
  );`

  const CREATE_CATEGORIES_TABLE = `
    CREATE TABLE IF NOT EXISTS Categories (
      category_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      category_name TEXT NOT NULL
  );`

  const CREATE_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS Ingredients (
      ingredient_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      ingredient_name VARCHAR(100) NOT NULL
  );`

  const CREATE_STEPS_TABLE = `
    CREATE TABLE IF NOT EXISTS Steps (
      step_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      step_description TEXT NOT NULL
  );`

  const CREATE_RECIPE_CATEGORIES_TABLE = `
    CREATE TABLE IF NOT EXISTS RecipeCategories (
      recipe_id INT,
      category_id INT,
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
      FOREIGN KEY (category_id) REFERENCES Categories(category_id),
      PRIMARY KEY (recipe_id, category_id)
  );`

  const CREATE_RECIPE_INGREDIENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS RecipeIngredients (
      recipe_id INT,
      ingredient_id INT,
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
      FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id),
      PRIMARY KEY (recipe_id, ingredient_id)
  );`

  const CREATE_RECIPE_STEPS_TABLE = `
    CREATE TABLE IF NOT EXISTS RecipeSteps (
      recipe_id INT,
      step_id INT,
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
      FOREIGN KEY (step_id) REFERENCES Steps(step_id),
      PRIMARY KEY (recipe_id, step_id)
  );`

  connection.connect();

  try {
    await Promise.all([
      executeQuery(CREATE_RECIPES_TABLE),
      executeQuery(CREATE_CATEGORIES_TABLE),
      executeQuery(CREATE_INGREDIENTS_TABLE),
      executeQuery(CREATE_STEPS_TABLE),
      executeQuery(CREATE_RECIPE_CATEGORIES_TABLE),
      executeQuery(CREATE_RECIPE_INGREDIENTS_TABLE),
      executeQuery(CREATE_RECIPE_STEPS_TABLE)
    ]);

    await Promise.all(recipes.map(rec => executeQuery('INSERT INTO recipes SET ?', rec)));
    await Promise.all(categories.map(cat => executeQuery('INSERT INTO categories SET ?', cat)));
    await Promise.all(ingredients.map(ing => executeQuery('INSERT INTO ingredients SET ?', ing)));
    await Promise.all(steps.map(step => executeQuery('INSERT INTO steps SET ?', step)));
    await Promise.all(recipeCategories.map(recipeCat => executeQuery('INSERT INTO recipeCategories SET ?', recipeCat)));
    await Promise.all(recipeIngredients.map(recipeIng => executeQuery('INSERT INTO recipeIngredients SET ?', recipeIng)));
    await Promise.all(recipeSteps.map(recipeStep => executeQuery('INSERT INTO recipeSteps SET ?', recipeStep)));
    
    connection.query(
      "SELECT r.recipe_name FROM Recipes r JOIN RecipeCategories rc ON r.recipe_id = rc.recipe_id JOIN Categories c ON rc.category_id = c.category_id JOIN RecipeIngredients ri ON r.recipe_id = ri.recipe_id JOIN Ingredients i ON ri.ingredient_id = i.ingredient_id WHERE c.category_name = 'Vegetarian' AND i.ingredient_name = 'Potatoes';",
      (err, results) => {
        if (err) throw err;
        console.log('Vegetarian recipes that include potatoes: ', results);
      }
    );

    connection.query(
      "SELECT r.recipe_name, c.category_name FROM Recipes r JOIN RecipeCategories rc ON r.recipe_id = rc.recipe_id JOIN Categories c ON rc.category_id = c.category_id WHERE c.category_name = 'No-bake';",
      (err, results) => {
        if (err) throw err;
        console.log('Cake recipes that do not need baking: ', results);
      }
    );

    connection.query(
      "SELECT r.recipe_name, c.category_name FROM Recipes r JOIN RecipeCategories rc ON r.recipe_id = rc.recipe_id JOIN Categories c ON rc.category_id = c.category_id WHERE c.category_name = 'Japanese' OR c.category_name = 'Vegan';",
      (err, results) => {
        if (err) throw err;
        console.log('Recipes found under Japanese and Vegetarian categories: ', results);
      }
    );
  } catch (error) {
    console.error(error);
  }

  connection.end();
}

coreDatabase();