/* eslint-disable no-underscore-dangle */
const express = require('express');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const Post = require('../models/Post');
const uploadCloud = require('../config/cloudinary.js');

const router = express.Router();
const completePosts = [];
let complete = [];

router.get('/home', async (req, res) => {
  const allPosts = await Post.find();
  allPosts.forEach(async (item, index) => {
    completePosts[index] = item;
    completePosts[index].profile = await Candidate.findById(item.authorId);
    return completePosts[index];
  });

  complete = completePosts;

  const perfilCandidate = await Candidate.findById(req.session.currentUser._id);
  const perfilCompany = await Company.findById(req.session.currentUser._id);

  res.render('home', {
    allPosts, perfilCandidate, perfilCompany, complete,
  });
});

router.get('/perfil-candidate', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const perfil = await Candidate.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  res.render('perfilCandidate', { perfil, myPosts });
});

router.get('/delete-post/:deleteId', async (req, res) => {
  await Post.findByIdAndDelete(req.params.deleteId);
  const perfil = await Candidate.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  res.render('perfilCandidate', { perfil, myPosts });
});

router.post('/post', uploadCloud.single('imageUrl'), async (req, res) => {
  const image = req.file.url;
  const { message } = req.body;
  if (!image || !message) {
    res.render('home', {
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!',
    });
    return;
  }

  const authorId = req.session.currentUser._id;
  const newPost = new Post({ image, message, authorId });

  await newPost.save();

  res.redirect('/home');
});

router.get('/update-perfil-candidate/:editId', async (req, res) => {
  const updatePerfil = await Candidate.findById(req.params.editId);
  return res.render('perfilCandidateComplete', updatePerfil);
});

router.post(
  '/update-perfil-candidate',
  uploadCloud.fields([
    {
      name: 'imagePerfil',
      maxCount: 1,
    },
    {
      name: 'imageCapa',
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    if (req.files) {
      if (req.files.imagePerfil && req.files.imagePerfil.length > 0) {
        req.body.imagePerfil = req.files.imagePerfil[0].url;
      }
      if (req.files.imageCapa && req.files.imageCapa.length > 0) {
        req.body.imageCapa = req.files.imageCapa[0].url;
      }
    }
    try {
      await Candidate.findByIdAndUpdate(req.session.currentUser._id, req.body);

      return res.redirect('/perfil-candidate');
    } catch (err) {
      return res.render('error', {
        errorMessage: `Erro ao editar Candidato: ${err}`,
      });
    }
  },
);

module.exports = router;
