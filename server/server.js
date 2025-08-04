const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;

const route = require('./src/routes/index');
const { syncModels } = require('./src/models');
const app = express();

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
};
app.use(cors(corsOptions));
route(app);

syncModels();

app.listen(PORT, () => {
  console.log(`Connected to server: http://localhost:`+ PORT); 
});