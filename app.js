require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const session = require('express-session');
const app = express();

// MongoBD Atlas

const url = 'mongodb+srv://usuario_mj:Modjobs123@clusterbe-rrue3.mongodb.net/test?retryWrites=true&w=majority';
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


module.exports = app;
