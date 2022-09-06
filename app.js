require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

const app = express();
const router = require('./routes');

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
