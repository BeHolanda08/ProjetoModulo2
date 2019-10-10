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
  const allPosts = await Post.find().sort({ date: -1 });
  allPosts.forEach(async (item, index) => {
    completePosts[index] = item;
    completePosts[index].profileCandidate = await Candidate.findById(item.authorId);
    completePosts[index].profileCompany = await Company.findById(item.authorId);
    //Handlebars
    const applysInfo = completePosts[index].candidatesId.split(',');

    applysInfo.forEach((elem) => {
      if (elem === req.session.currentUser._id) {
        completePosts[index].apply = true;
      }
    });

    return completePosts[index];
  });

  complete = completePosts;

  const perfilCandidate = await Candidate.findById(req.session.currentUser._id);
  const perfilCompany = await Company.findById(req.session.currentUser._id);

  res.render('home', { perfilCandidate, perfilCompany, complete });
});

router.get('/perfil-candidate', async (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const perfil = await Candidate.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  let skills = [];
  if (perfil.skill !== undefined && perfil.skill.length > 0) {
    skills = perfil.skill.split(',');
  }

  res.render('perfilCandidate', { perfil, myPosts, skills });
});

router.get('/delete-post/:deleteId', async (req, res) => {
  await Post.findByIdAndDelete(req.params.deleteId);
  const perfil = await Candidate.findById(req.session.currentUser._id);
  const myPosts = await Post.find({ authorId: req.session.currentUser._id });
  res.render('perfilCandidate', { perfil, myPosts });
});

router.post('/post', uploadCloud.single('imageUrl'), async (req, res) => {
  const image = req.file.url;
  let d = new Date();
  let date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  let time = " - "+d.getHours()+":"+d.getMinutes();
  date += time;
  const { message } = req.body;
  if (!image || !message) {
    res.render('home', {
      errorMessage: 'Por favor, preencha todos os campos obrigatórios!',
    });
    return;
  }

  const authorId = req.session.currentUser._id;
  const newPost = new Post({ image, message, authorId, date });

  await newPost.save();

  res.redirect('/home');
});

router.get('/apply-post/:postId', async (req, res) => {
  const selectedPost = await Post.findById(req.params.postId);

  if (!selectedPost.candidatesId) {
    //Realiza a candidatura do Candidato
    const filter = { candidatesId: undefined };
    const update = { candidatesId: req.session.currentUser._id };
    await Post.updateOne( filter, update);

    res.redirect('/home');
  } else if (selectedPost.candidatesId !== req.session.currentUser._id) {
    const filter = { candidatesId: selectedPost.candidatesId };
    const update = { candidatesId: `${selectedPost.candidatesId},${req.session.currentUser._id}` };
    await Post.updateOne( filter, update);

    res.redirect('/home');
  } else {
    const filter = { candidatesId: req.session.currentUser._id };
    const update = { candidatesId: undefined };
    await Post.updateOne( filter, update);

    res.redirect('/home');
  }
});

router.get('/update-perfil-candidate/:editId', async (req, res) => {
  const perfil = await Candidate.findById(req.session.currentUser._id);
  const updatePerfil = await Candidate.findById(req.params.editId);
  return res.render('perfilCandidateComplete', { perfil, updatePerfil });
});

router.post('/update-perfil-candidate', uploadCloud.fields([
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
