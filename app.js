const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '62fb6cdc6ccb6b5f71c39a07',
  };

  next();
});
const router = require('./routes');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {});
