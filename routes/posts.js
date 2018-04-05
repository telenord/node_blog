const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

/* GET posts listing. */
router.get('/add', function(req, res, next) {

  res.render('addpost', {title: 'Add post'});
});

router.post('/add', function(req, res, next) {
  const {title, body, category, author} = req.body;
  const date = new Date();

  res.send('respond with a resource');
});

module.exports = router;
