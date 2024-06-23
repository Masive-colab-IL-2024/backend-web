const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const routeAuth = require("./route/authRoute");
const Diagnosis = require("./route/diagnosisRoutes");
const News = require("./route/newsRoute");
const { testConnection } = require("./database/Db");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(routeAuth);
app.use(Diagnosis);
app.use(News);

app.listen(process.env.APP_PORT, async () => {
  await testConnection();
  console.log(`Server running di port ${process.env.APP_PORT}`);
});
module.exports = app;