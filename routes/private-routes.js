const express = require('express');

const router = express.Router();

router.get('/home', (req, res) => {
  console.log("entrei rota");
  res.render('home');
});

module.exports = router;
