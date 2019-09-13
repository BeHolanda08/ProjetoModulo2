const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
