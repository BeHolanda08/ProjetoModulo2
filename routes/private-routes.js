const express = require('express');
const Candidate = require('../models/Candidate');
const Post = require('../models/Post');

const router = express.Router();

router.get('/home', async (req, res) => {
  const allPosts = await Post.find();
  res.render('home', { allPosts });
});

router.get('/perfil-candidate', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const perfilCandidate = await Candidate.findById(req.session.currentUser._id);
  res.render('perfilCandidate', perfilCandidate);
});

router.post('/post', async (req, res) => {

  const { url, message } = req.body;

  if (!url || !message) {
    res.render('index', { errorMessage: 'Por favor, preencha todos os campos obrigatórios!' });
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const authorId = req.session.currentUser._id;
  const newPost = new Post({ url, message, authorId });

  await newPost.save();

  res.redirect('/home');
});

module.exports = router;
