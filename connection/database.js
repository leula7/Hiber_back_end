import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: 'config.env'});
//hi
const hosts = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_Name = process.env.DB_Name;
// Initialize Sequelize with database credentials
const sequelize = new Sequelize(DB_Name,DB_USER,DB_PASSWORD, {
  host: hosts, // Replace with your database host
  dialect: 'mysql',
 // Replace with your database dialect (e.g., mysql, postgres, sqlite)
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  export default sequelize;
