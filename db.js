
require('dotenv').config();

const msnodesqlv8 = require('msnodesqlv8');

const connectionString =
  'Driver={ODBC Driver 18 for SQL Server};' +
  `Server=${process.env.DB_SERVER};` +
  `Database=${process.env.DB_NAME};` +
  'Trusted_Connection=Yes;' +
  'TrustServerCertificate=Yes;';

function query(sqlText) {
  return new Promise((resolve, reject) => {
    msnodesqlv8.query(connectionString, sqlText, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ recordset: rows });
    });
  });
}

// Сохраняем интерфейс, который использует app.js
const poolPromise = Promise.resolve({
  request() {
    return {
      query
    };
  }
});

module.exports = { poolPromise };
