const {GoogleGenAI} = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// DELAY HELPER
// ======================================================

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


// ======================================================
// ANALYZE IMAGE WITH GEMINI
// ======================================================

const analyzeImage = async (
  imageBuffer,
  mimeType,
) => {

  // Convert image buffer to Base64
  const base64Image =
    imageBuffer.toString('base64');


  const prompt = `
You are an AI assistant for an e-waste recycling application.

Analyze the main object in the image.

Determine whether it is an electronic device or e-waste.

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.

Use exactly this structure:

{
  "is_ewaste": false,
  "device_name": "",
  "device_category": "",
  "brand": "",
  "model": "",
  "confidence": 0,
  "condition": "",
  "visible_components": [],
  "hazardous_components": [],
  "recyclable_materials": [],
  "environmental_risks": [],
  "estimated_recyclability": "",
  "estimated_eco_coins": 0,
  "disposal_recommendation": "",
  "reason": ""
}

Rules:

- If the object is not e-waste, set "is_ewaste" to false.
- If it is e-waste, set "is_ewaste" to true.
- Identify the device only from reasonable visual evidence.
- Do not invent an exact brand or model.
- Confidence must be a number from 0 to 100.
- Keep the response concise.
- Hazardous components and recyclable materials may be likely
  components based on the identified device type.
- Clearly distinguish visible information from likely composition.
- Estimate eco coins based on the device type, approximate size,
  condition, and likely recyclable value.
- "estimated_eco_coins" must be a whole number.
- If the object is not e-waste, set "estimated_eco_coins" to 0.
- The eco coin value is only an estimate.
`;


  // ======================================================
  // RETRY SETTINGS
  // ======================================================

  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    try {

      console.log(
        `Gemini analysis attempt ${attempt}/${maxAttempts}`,
      );


      const response =
        await ai.models.generateContent({

          model: 'gemini-3.6-flash',

          contents: [
            {
              role: 'user',

              parts: [
                {
                  text: prompt,
                },

                {
                  inlineData: {
                    mimeType:
                      mimeType ===
                      'application/octet-stream'
                        ? 'image/jpeg'
                        : mimeType,

                    data: base64Image,
                  },
                },
              ],
            },
          ],

        });


      let text = response.text;


      // Remove markdown fences if AI adds them
      text = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();


      return JSON.parse(text);


    } catch (error) {

  console.error(
    `Gemini attempt ${attempt} failed:`,
    error.message,
  );

  const errorMessage =
    error.message?.toLowerCase() || '';

  const status =
    error.status || error.code;

  // ==========================================
  // TEMPORARY HIGH DEMAND
  // ==========================================

  if (status === 503) {

    if (attempt < maxAttempts) {

      const waitTime = attempt * 2000;

      console.log(
        `Gemini busy. Retrying in ${
          waitTime / 1000
        } seconds...`,
      );

      await delay(waitTime);

      continue;
    }

    throw new Error(
      'AI service is currently experiencing high demand. Please try again in a few minutes.',
    );
  }


  // ==========================================
  // RATE LIMIT / QUOTA LIMIT
  // ==========================================

  if (status === 429) {

    if (
      errorMessage.includes('quota') ||
      errorMessage.includes('limit') ||
      errorMessage.includes('resource_exhausted')
    ) {

      throw new Error(
        'AI usage limit has been reached. Please try again later.',
      );
    }

    throw new Error(
      'Too many requests were made. Please wait a moment and try again.',
    );
  }


  // ==========================================
  // API KEY PROBLEM
  // ==========================================

  if (
    errorMessage.includes('api key') ||
    errorMessage.includes('api_key_invalid')
  ) {

    throw new Error(
      'AI service configuration error.',
    );
  }


  // ==========================================
  // TOKEN / RESOURCE EXHAUSTED
  // ==========================================

  if (
    errorMessage.includes('token') ||
    errorMessage.includes('resource exhausted') ||
    errorMessage.includes('exhausted')
  ) {

    throw new Error(
      'AI usage limit or available resources have been exhausted. Please try again later.',
    );
  }


  // ==========================================
  // OTHER ERRORS
  // ==========================================

  throw new Error(
    'Unable to analyze the image. Please try again.',
  );

}

  }

};


module.exports = {
  analyzeImage,
};