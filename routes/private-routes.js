const express = require('express');
const Candidate = require('../models/Candidate');
const Post = require('../models/Post');
const uploadCloud = require('../config/cloudinary.js');

const router = express.Router();

router.get('/home', async (req, res) => {
  const allPosts = await Post.find();
  res.render('home', { allPosts });
});

router.get(
  '/perfil-candidate',
  uploadCloud.single('imageUrl'),
  async (req, res) => {
    // eslint-disable-next-line no-underscore-dangle
    const perfil = await Candidate.findById(req.session.currentUser._id);
    res.render('perfilCandidate', { perfil });
  }
);

router.post('/post', uploadCloud.single('imageUrl'), async (req, res) => {
  const image = req.file.url;
  const { message } = req.body;
  if (!image || !message) {
    res.render('home', {
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!'
    });
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const authorId = req.session.currentUser._id;
  const newPost = new Post({ image, message, authorId });

  await newPost.save();

  res.redirect('/home');
});

router.get('/update-perfil-candidate/:editId', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle

  const updatePerfil = await Candidate.findById(req.params.editId);
  return res.render('perfilCandidateComplete', updatePerfil);
});

router.post('/update-perfil-candidate', async (req, res) => {
  try {
    await Candidate.findByIdAndUpdate(req.body._id, req.body);
    return res.redirect('/perfil-candidate');
  } catch (err) {
    return res.render('error', {
      errorMessage: `Erro ao editar Candidato: ${err}`
    });
  }
});

module.exports = router;
