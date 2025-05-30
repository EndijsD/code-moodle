import mysql from 'mysql2'

const db = mysql.createConnection({
  user: process.env.MYSQLUSER,
  host: process.env.MYSQLHOST,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
})

db.connect((err) => {
  if (err) throw err
  console.log('MySQL Connected')
})

export default db
