const mongoose = require('mongoose');

const { Schema } = mongoose;

const candidateSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  celPhone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  imagePerfil: String,
  imageCapa: String,
  skills: String,
  address: String,
  number: Number,
  complement: String,
  city: String,
  state: String,
  zipCode: String,
  link1: String,
  link2: String,
  link3: String,
  link4: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
