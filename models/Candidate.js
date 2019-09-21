const mongoose = require('mongoose');

const { Schema } = mongoose;

const candidateSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  celPhone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: String,
  imagePerfil: String,
  skills: String,
  address: String,
  number: Number,
  complement: String,
  city: String,
  state: String,
  zipCode: Number,
  linkFace: String,
  linkInsta: String,
  linkedin: String,
  gitHub: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
