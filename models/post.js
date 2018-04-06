const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const PostSchema = mongoose.Schema({
  title:String,
  body: String,
  category: String,
  author: String,
  mainImage: String,
});

const Post = module.exports = mongoose.model('User', PostSchema);

