const express = require("express");
const app = express();
require("dotenv/config");
const { PORT } = process.env;
const port = PORT;
const cors = require("cors");
const morgan = require('morgan')
const dataBase = require('./config/configDb');
const adminRouter = require("./routes/adminRoutes");
const userRouter = require('./routes/userRoutes')

app.use(express.json())
app.use(cors());
app.use(morgan('dev'))
dataBase()

app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)

app.listen(port, () => {
  console.log(`App is listening to Port:${port}`);
});
