const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  image: { type: String },
  message: { type: String, required: true },
  authorId: { type: String, required: true },
  date: { type: Date },
  link: { type: String },
  candidatesId: { type: String },
  comment: { type: String },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
