// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');

const { login, createUser } = require('./controllers/users');
const { signupValidate, signinValidate } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydb');

app.use(requestLogger);

app.post('/signup', signupValidate, createUser);
app.post('/signin', signinValidate, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваеме данные не найдены'));
});

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`Запущено через порт ${PORT}`);
});
