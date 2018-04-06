//const Loki = require('lokijs') ;

const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// const loadCollection =  (colName, db)=> {
//   return new Promise(resolve => {
//     db.loadDatabase({}, () => {
//       const _collection = db.getCollection(colName) || db.addCollection(colName);
//       resolve(_collection);
//     })
//   });
// };

module.exports = imageFilter;
//module.exports = loadCollection;
