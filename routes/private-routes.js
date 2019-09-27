const express = require('express');
const Candidate = require('../models/Candidate');
const Post = require('../models/Post');
const uploadCloud = require('../config/cloudinary.js');


const router = express.Router();

router.get('/home', async (req, res) => {
  const allPosts = await Post.find();
  res.render('home', { allPosts });
});

router.get('/perfil-candidate', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const perfil = await Candidate.findById(req.session.currentUser._id);
  res.render('perfilCandidate', { perfil });
});

router.post('/post', uploadCloud.single('imageUrl'), async (req, res) => {
  const { message } = req.body;
  const image = req.file.url;
  if (!image || !message) {
    res.render('index', { errorMessage: 'Por favor, preencha todos os campos obrigatórios!' });
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const authorId = req.session.currentUser._id;
  const newPost = new Post({ image, message, authorId });

  await newPost.save();

  res.redirect('/home');
});

router.get('/update-perfil-candidate', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const updatePerfil = await Candidate.findById(req.session.currentUser._id);
  res.render('perfilCandidateComplete', { updatePerfil });
});


module.exports = router;

