const express = require('express');
const Company = require('../models/Company');
const Post = require('../models/Post');
const uploadCloud = require('../config/cloudinary.js');

const router = express.Router();

router.get('/home', async (req, res) => {
  const allPosts = await Post.find();
  res.render('home', { allPosts });
});

router.get('/perfil-company', async (req, res) => {
  const perfil = await Company.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  res.render('perfilCompany', { perfil, myPosts });
});

router.get('/delete-post/:deleteId', async (req, res) => {
  await Post.findByIdAndDelete(req.params.deleteId);
  const perfil = await Company.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  res.render('perfilCompany', { perfil, myPosts });
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

router.get('/update-perfil-company/:editId', async (req, res) => {
  const updatePerfil = await Company.findById(req.params.editId);
  return res.render('perfilCompanyComplete', updatePerfil);
});

router.post(
  '/update-perfil-company',
  uploadCloud.fields([
    {
      name: 'imagePerfil',
      maxCount: 1
    },
    {
      name: 'imageCapa',
      maxCount: 1
    }
  ]),
  async (req, res) => {
    console.log(req.body);
    if (req.files) {
      if (req.files.imagePerfil && req.files.imagePerfil.length > 0) {
        req.body.imagePerfil = req.files.imagePerfil[0].url;
      }
      if (req.files.imageCapa && req.files.imageCapa.length > 0) {
        req.body.imageCapa = req.files.imageCapa[0].url;
      }
    }
    try {
      await Company.findByIdAndUpdate(req.session.currentUser._id, req.body);
      console.log(req.body);

      return res.redirect('/perfil-company');
    } catch (err) {
      return res.render('error', {
        errorMessage: `Erro ao editar Company: ${err}`
      });
    }
  }
);

module.exports = router;
