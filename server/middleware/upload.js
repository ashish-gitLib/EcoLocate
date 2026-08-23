const multer = require('multer');


// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();


const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


module.exports = upload;