
require('dotenv').config();

const msnodesqlv8 = require('msnodesqlv8');

const connectionString =
  'Driver={ODBC Driver 18 for SQL Server};' +
  'Server=tcp:127.0.0.1,1433;' +
  'Database=BasketShop;' +
  'Trusted_Connection=Yes;' +
  'TrustServerCertificate=Yes;';

console.log('Проверяем прямое подключение через ODBC Driver 18...');

msnodesqlv8.query(
  connectionString,
  'SELECT @@SERVERNAME AS ServerName, DB_NAME() AS DatabaseName, SUSER_SNAME() AS CurrentLogin',
  (error, rows) => {
    if (error) {
      console.log('Ошибка ODBC:');
      console.log(error.message);
      console.log(error);
      return;
    }

    console.log('ПОДКЛЮЧЕНИЕ УСПЕШНО!');
    console.log(rows);
  }
);
