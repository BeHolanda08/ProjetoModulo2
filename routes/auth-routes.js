const express = require('express');
const bcrypt = require('bcrypt');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');

const router = express.Router();
const saltRounds = 10;

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('index', {
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!'
    });
    return;
  }

  const candidate = await Candidate.findOne({ email });
  const company = await Company.findOne({ email });

  if (candidate) {
    if (bcrypt.compareSync(password, candidate.password)) {
      req.session.currentUser = candidate;
      res.redirect('home');
    } else {
      res.render('index', { errorMessage: 'Senha incorreta.' });
    }
  } else if (company) {
    if (bcrypt.compareSync(password, company.password)) {
      req.session.currentUser = company;
      res.redirect('home');
    } else {
      res.render('index', { errorMessage: 'Senha incorreta.' });
    }
  }
});

router.get('/signUp', (req, res) => {
  res.render('signUp');
});

router.get('/signUpCandidate', (req, res) => {
  res.render('signUpCandidate');
});

// eslint-disable-next-line consistent-return
router.post('/signUpCandidate', async (req, res) => {
  const { name, email, password, password2, surname, celPhone } = req.body;

  // validação de candidate
  if (!name || !email || !password || !surname || !celPhone) {
    return res.render('signUpCandidate', {
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!'
    });
  }

  if (password !== password2) {
    return res.render('signUpCandidate', {
      errorMessage: 'Senha não confere!'
    });
  }

  if (Candidate.findOne({ email })) {
    return res.render('signUpCandidate', {
      errorMessage: 'Usuário já cadastrado!'
    });
  }

  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newCandidate = new Candidate({
      name,
      email,
      password: hash,
      surname,
      celPhone
    });
    await newCandidate.save();
    res.redirect('/');
  } catch (error) {
    console.log(error, 'Erro de Login!');
  }
});

router.get('/signUpCompany', (req, res) => {
  res.render('signUpCompany');
});

// eslint-disable-next-line consistent-return
router.post('/signUpCompany', async (req, res) => {
  const { name, phone, email, password, password2 } = req.body;

  // validação de company
  if (!name || !phone || !email || !password) {
    return res.send('signUpCompany', {
      errorMessage: 'Por favor, preencha todos os campos Obrigatórios!'
    });
  }

  if (password !== password2) {
    return res.render('signUpCompany', { errorMessage: 'Senha não confere!' });
  }

  if (await Company.findOne({ email })) {
    return res.send({ error: 'Empresa já cadastrado!' });
  }

  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newCompany = new Company({
      name,
      phone,
      email,
      password: hash
    });
    await newCompany.save();
    res.redirect('/');
  } catch (error) {
    console.log(error, 'Erro de Login!');
  }
});

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

// eslint-disable-next-line consistent-return
router.post('/forgotPassword', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.render('forgotPassword');
  }
});

router.get('/passwordSubmission', (req, res) => {
  res.render('passwordSubmission');
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
