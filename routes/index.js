const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');

const url = 'localhost:27017/nodeblog';

const db = monk(url);


db.then(() => {
  console.log('Connected correctly to mongodb');
}).catch((err)=>{
  console.log('Failed connect to mongodb', err);
});

/* GET home page. */
router.get('/', (req, res, next)=> {
  const collection = db.get('nodeblog');
  collection.find()
    .then(posts =>{
      console.log(posts);
      res.render('index', { title: 'Express', posts });
    })
    .catch(err=>{
      console.log('error find',err);
    })

});

module.exports = router;
