const express = require('express');
const Candidate = require('../models/Candidate');

const router = express.Router();

router.get('/home', (req, res) => {
  res.render('home');
});

// router.get('/perfilCandidate', (req, res) => {
//   res.render('perfilCandidate');
// });
router.get('/perfil-candidate', async (req, res) => {
  const perfilCandidate = await Candidate.findById(req.session.currentUser._id);
  console.log(req.session.currentUser._id);
  res.render('perfilCandidate', perfilCandidate);
});

module.exports = router;
