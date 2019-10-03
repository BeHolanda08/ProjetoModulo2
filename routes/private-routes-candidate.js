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
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!'
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
  uploadCloud.array('images', 2),
  async (req, res) => {
    const images = req.files;
    const imagePerfil = images[0].url;
    const imageCapa = images[1].url;
    const {
      name,
      surname,
      skills,
      address,
      number,
      complement,
      city,
      state,
      zipCode,
      link1,
      link2,
      link3,
      link4
    } = req.body;
    try {
      await Candidate.findByIdAndUpdate(req.session.currentUser._id, {
        name,
        surname,
        skills,
        address,
        number,
        complement,
        city,
        state,
        zipCode,
        link1,
        link2,
        link3,
        link4,
        imagePerfil,
        imageCapa
      });

      return res.redirect('/perfil-candidate');
    } catch (err) {
      return res.render('error', {
        errorMessage: `Erro ao editar Candidato: ${err}`
      });
    }
  }
);

module.exports = router;
