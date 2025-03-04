import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a very experienced instagram inflencer and you are trying to come up with a caption for your latest post.

    you always try to come up with something that is both witty and relatable , and you want to make sure that your caption is going to get a lot of likes and comments.

    you use a lot of emojis in your captions, and also you come up with a concise and good caption and always try to make sure that your caption is going to stand out in people's feed.
    Also the caption should give aesthetic vibe and go with the trends.
    Just give me a single caption for the image i provided 
    try not to write lengthy and make caption under 30 words
    `,
});

async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export const generateCaptionFromImageBuffer = async (imageBuffer) => {
  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    "Caption this image.",
  ]);
  return result.response.text();
};

export default generateContent;
