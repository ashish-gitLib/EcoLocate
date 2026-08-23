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

    // Send the actual user-friendly error
    // from visionService.js to the app

    return res.status(
      error.status || 500,
    ).json({
      success: false,
      message:
        error.message ||
        'Unable to analyze the image.',
    });

  }

};


module.exports = {
  analyzeUploadedImage,
};