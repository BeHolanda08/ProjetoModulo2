require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authRouter = require('./routes/auth-routes');
const privateRoutesCandidate = require('./routes/private-routes-candidate');
const privateRoutesCompany = require('./routes/private-routes-company');

const app = express();

// MongoBD Atlas

const url = process.env.DB_HOST;
const options = {
  // eslint-disable-next-line max-len
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 5,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Mongoose

mongoose.connect(url, options);
mongoose.set('useCreatIndex', true);

mongoose.connection.on('error', err => {
  console.log(`Erro na conexão com o banco de Dados: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Aplicação desconectada do banco de Dados!');
});

mongoose.connection.on('connected', () => {
  console.log('Aplicação conectada com o banco de Dados!');
});

app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

// Body-Parser

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'auth-secret',
    cookie: { maxAge: 600000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
  })
);

app.use('/', authRouter);

// Protected Routes Middleware
app.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
});

app.use('/', privateRoutesCandidate);
app.use('/', privateRoutesCompany);

app.listen(process.env.PORT, () => {
  console.log('Express rodando');
});

module.exports = app;
