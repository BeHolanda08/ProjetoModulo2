require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Company = require('./models/Company');
const bcrypt = require('bcrypt');

// const session = require('express-session');
const app = express();

const saltRounds = 10;

// MongoBD Atlas

const url = process.env.DB_HOST;
const options = {
  reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true };

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

app.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('index', { 
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!' });
    return;
}

  const candidate = await Candidate.findOne({ email, password });
  const company = await Company.findOne({ email, password });


  if (!candidate) {
    console.log(candidate);
    res.render('index', { errorMessage: "The username doesn't exist." });
    return;
  }
  if (bcrypt.compareSync(password, candidate.password)) {
    // req.session.currentUser = candidate;
    res.redirect('/home');
  } else {
    res.render('/', { errorMessage: 'Incorrect password' });
  }
});

app.get('/signUp', (req, res) => {
  res.render('signUp');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/signUpCandidate', (req, res) => {
  res.render('signUpCandidate');
});

app.post('/signUpCandidate', async (req, res) => {
  const { name, email, password, surname, celPhone } = req.body;

  // validação de candidate
  if (!name || !email || !password || !surname || !celPhone) {
    return res.send('signupCandidate', { errorMessage: 'Por favor, preencha todos os campos obrigatórios!' });
  }

  if (await Candidate.findOne({ email })) {
    return res.send({ error: 'Usuário já cadastrado!' });
  }

  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newCandidate = new Candidate({ name, email, password: hash, surname, celPhone });
    await newCandidate.save();
    res.redirect('/');
  } catch (error) {
    console.log(error, 'Erro de Login!');
  }
});


app.get('/signUpCompany', (req, res) => {
  res.render('signUpCompany');
});

app.post('/signUpCompany', async (req, res) => {
  const { name, phone, email, password } = req.body;

  // validação de company
  if (!name || !phone || !email || !password) {
    res.send('signUpCompany', { errorMessage: 'Por favor, preencha todos os campos Obrigatórios!' });
  }

  if (await Company.findOne({ email })) {
    return res.send({ error: 'Empresa já cadastrado!' });
  }

  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newCompany = new Company({ name, phone, email, password: hash });
    await newCompany.save();
    res.redirect('/');
  } catch (error) {
    console.log(error, 'Erro de Login!');
  }
});

app.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

app.post('/forgotPassword', (req, res) => res.render('forgotPassword', { errorMessage: 'Please fill all required fields!' }));

app.get('/passwordSubmission', (req, res) => {
  res.render('passwordSubmission');
});

app.listen(3000, () => {
  console.log('Express rodando');
});

app.set('views', `${__dirname}/views`);

app.set('view engine', 'hbs');


module.exports = app;
