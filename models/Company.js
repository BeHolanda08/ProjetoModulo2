const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
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
  zipCode: Number,
  site: String,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
