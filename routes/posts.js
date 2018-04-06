const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const multer = require('multer');
const imageFilter = require('../utils/utils');
const mongo = require('mongodb');
const monk = require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);


const upload = multer({dest: 'uploads/', fileFilter: imageFilter});

/* GET posts listing. */
router.get('/add', function (req, res, next) {
  //const categories = db.get('categories');
  db.get('categories').find()
    .then(categories =>{
      console.log(categories);
      res.render('addpost', {title: 'Add post', categories });
    })
    .catch(err=>{
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

  const mainImage = file ? file.originalname : 'noimage.jpg';

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('addpost', {errors: errors.mapped()});
  } else {

    const posts = db.get('posts');

    posts.insert({title, body, category, author, date, mainImage})
      .then((post)=>{
        console.log(post);
        req.flash('success', 'Post added');
        res.location('/');
        res.redirect('/');
        })
      .catch(err=>{
        console.log(err);
        res.send(err);
      })
    // , (err, post) => {
    //   if (err) {
    //
    //
    //   } else {
    //
    //   }
    // })
  }
});

module.exports = router;
