const express = require("express");
const app = express();
require("dotenv/config");
const { PORT } = process.env;
const port = PORT;
const cors = require("cors");
const morgan = require('morgan')
const dataBase = require('./config/configDb')

app.use(express.json())
app.use(cors());
app.use(morgan('dev'))
dataBase()

app.listen(port, () => {
  console.log(`App is listening to Port:${port}`);
});
