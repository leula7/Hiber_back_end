import pool from "./connection.js"

async function executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(query, params);
      return rows;
    } catch (error) {
      console.error(error); // log the error to the console
      throw error;
    } finally {
      connection.release();
    }
  }

  export { executeQuery };