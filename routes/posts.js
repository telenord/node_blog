const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const multer = require('multer');
const imageFilter = require('../utils/utils');
const mongo = require('mongodb');
const monk = require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);


const upload = multer({dest: './public/images/uploads/', fileFilter: imageFilter});

router.get('/add', function (req, res, next) {
  db.get('categories').find()
    .then(categories => {
      res.render('addpost', {title: 'Add post', categories});
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
});

router.get('/show/:id', function (req, res, next) {
  const _id = req.params.id;
  db.get('posts').findOne({_id})
    .then(post => {
      console.log(post);
      res.render('post', {post});
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
});

router.post('/add', [
  upload.single('mainimage'),
  check('title', 'Title fileld is required')
    .trim()
    .exists(),
  check('body', 'Body fileld is required')
    .trim()
    .exists(),
  check('author', 'Author fileld is required')
    .trim()
    .exists(),
], function (req, res, next) {
  const {file, body: {title, body, category, author}} = req;
  const date = new Date();
  const mainImage = file ? file.filename : 'noimage.jpg';
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('addpost', {errors: errors.mapped()});
  } else {
    const posts = db.get('posts');
    posts.insert({title, body, category, author, date, mainimage: mainImage})
      .then((post) => {

        req.flash('success', 'Post added');
        res.location('/');
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })
  }
});

router.post('/addcomment', [
  check('email', 'Email fileld is required')
    .exists()
    .isEmail()
    .withMessage('Must be an email')
    .normalizeEmail(),
  check('name','Name fileld is required' )
    .trim()
    .exists()
    .withMessage('Name32 fileld is requireds'),
  check('body', 'Body fileld is required')
    .trim()
    .exists(),
], function (req, res, next) {
  const {name, body, email, postid} = req.body;

  const commentdate = new Date();

  const posts = db.get('posts');
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    posts.findOne({_id: postid})
      .then(post => {
        res.render('post', {errors: errors.mapped(), post});
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })

  } else {
    const comment = {name, body, commentdate};
    posts.update({_id: postid}, {$push: {comments: comment}})
      .then((post) => {
        console.log(post);
        req.flash('success', 'Comment added');
        res.location(`/posts/show/${postid}`);
        res.redirect(`/posts/show/${postid}`);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })
  }
});

module.exports = router;
