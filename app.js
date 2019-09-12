require('dotenv').config();

const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const session = require('express-session');

const app = express();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/esqueciSenha', (req, res) => {
  res.render('esqueciSenha');
});

app.listen(3000, () => {
  console.log('Express rodando');
});

app.set('views', `${__dirname}/views`);

app.set('view engine', 'hbs');
