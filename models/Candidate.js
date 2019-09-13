const mongoose = require('mongoose');

const { Schema } = mongoose;

const candidateSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  celPhone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: String,
  address: String,
  number: Number,
  complement: String,
  city: String,
  state: String,
  zipCode: Number,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
