require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Company = require('./models/Company');

// const session = require('express-session');
const app = express();

// MongoBD Atlas

const url = process.env.DB_HOST;
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true };

// Mongoose

mongoose.connect(url, options);
mongoose.set('useCreatIndex', true);

mongoose.connection.on('error', (err) => {
  console.log(`Erro na conexão com o banco de Dados: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Aplicação desconectada do banco de Dados!');
});

mongoose.connection.on('connected', () => {
  console.log('Aplicação conectada com o banco de Dados!');
});

// Body-Parser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/signUp', (req, res) => {
  res.render('signUp');
});

app.get('/signUpCandidate', (req, res) => {
  res.render('signUpCandidate');
});

app.post('/signUpCandidate', async (req, res) => {
  const { name, email, password, surname, celPhone } = req.body;

  // validação de candidato
  if (name === '' || email === '' || password === '' || surname === '' || celPhone === '') {
    res.render('signupCandidate', { errorMessage: 'Please fill all required fields!' });
  }

  const newCandidate = new Candidate({ name, email, password, surname, celPhone });
  try {
    await newCandidate.save(); 
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});


app.get('/signUpCompany', (req, res) => {
  res.render('signUpCompany');
});

app.post('/signUpCompany', async (req, res) => {
  const { name, phone, email, password } = req.body;

  // validação de candidato
  if (name === '' || phone === '' || email === '' || password === '') {
    res.render('signUpCompany', { errorMessage: 'Please fill all required fields!' });
  }

  const newCompany = new Company({ name, phone, email, password });

  try {
    await newCompany.save();
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});


app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

app.listen(3000, () => {
  console.log('Express rodando');
});

app.set('views', `${__dirname}/views`);

app.set('view engine', 'hbs');


module.exports = app;
