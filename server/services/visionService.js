const {GoogleGenAI} = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// ANALYZE IMAGE WITH GEMINI
// ======================================================

const analyzeImage = async (
  imageBuffer,
  mimeType,
) => {

  try {

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
      'Gemini analysis error:',
      error,
    );

    throw new Error(
      'Unable to analyze image with AI.',
    );

  }

};


module.exports = {
  analyzeImage,
};