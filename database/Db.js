const Mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const Db = Mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function testConnection() {
  try {
    await Db.getConnection();
    console.log("Terkoneksi ke database");
  } catch (error) {
    console.log("koneksi gagal", error);
  }
}

async function query(query, value) {
  try {
    const [excekuteQuery] = await Db.query(query, value ?? []);
    return excekuteQuery;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  testConnection,
  query,
};
