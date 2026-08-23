const {analyzeImage} =
  require('../services/visionService');


// ======================================================
// ANALYZE IMAGE CONTROLLER
// ======================================================

const analyzeUploadedImage = async (
  req,
  res,
) => {

  try {

    // Check if image was uploaded
    if (!req.file) {

      return res.status(400).json({
        message:
          'Please upload an image.',
      });

    }


    // Send image to Gemini service
    const analysis =
      await analyzeImage(
        req.file.buffer,
        req.file.mimetype,
      );


    // Send AI result back
    return res.status(200).json({
      success: true,
      analysis: analysis,
    });


  } catch (error) {
  console.error(
    'Image analysis controller error:',
    error.message,
  );

  if (
    error.status === 429 ||
    error.message?.includes('quota')
  ) {
    return res.status(429).json({
      success: false,
      message:
        'AI analysis limit has been reached. Please try again later.',
    });
  }

  return res.status(500).json({
    success: false,
    message:
      'Unable to analyze the image.',
  });
}

};


module.exports = {
  analyzeUploadedImage,
};