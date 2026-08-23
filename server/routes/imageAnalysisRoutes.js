const express = require('express');

const router = express.Router();

const {
  analyzeUploadedImage,
} = require('../controllers/imageAnalysisController');

const upload = require('../middleware/upload');


// POST /api/analyze-image
router.post(
  '/',
  upload.single('image'),
  analyzeUploadedImage,
);


module.exports = router;