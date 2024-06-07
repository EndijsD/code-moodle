import mysql from 'mysql2';

const db = mysql.createConnection({
  user: process.env.MYSQLUSER || 'admin',
  host: process.env.MYSQLHOST || 'localhost',
  password: process.env.MYSQLPASSWORD || 'vHCMkV0@wb5c',
  database: process.env.MYSQLDATABASE || 'db',
  port: process.env.MYSQLPORT || '3306',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});

export default db;
