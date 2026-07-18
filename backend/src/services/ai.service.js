const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config");

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

const generateResult = async (prompt) => {
  console.log(config.GEMINI_API_KEY);
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });
  const result = response.text;
  console.log(result);
  return result;
};

module.exports = { generateResult };
