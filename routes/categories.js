const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const mongo = require('mongodb');
const monk = require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);


/* GET posts listing. */
router.get('/add', function (req, res, next) {
  res.render('addcategory', {title: 'Add category'});
});

router.post('/add', [
  check('name', 'CategoryName fileld is required')
    .trim()
    .exists(),

], function (req, res, next) {

  const {body: {name}} = req;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('addcategory', {errors: errors.mapped()});
  } else {

    const categories = db.get('categories');

    categories.insert({name})
      .then((category) => {
        console.log(category);
        req.flash('success', 'Category added');
        res.location('/');
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })

  }
});

module.exports = router;
