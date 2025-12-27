import { GoogleGenAI, Type } from "@google/genai";
import { OHCard } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAiCard = async (): Promise<OHCard> => {
  try {
    // 1. Generate the content (Quote + Image Prompt)
    const textModel = "gemini-3-flash-preview";
    
    // We explicitly ask for a quote style that matches the "Positive Psychology / OH Card" vibe
    // and an image prompt that matches the "Abstract / Watercolor / Ink" style of the user's reference images.
    const textPrompt = `
      Create content for a "Positive Psychology OH Card" (Insight Card).

      Return a JSON object with:
      1. 'quote': A single, profound, healing Chinese sentence (10-20 words). Examples: "顺境滋养，逆境成长", "凡是发生，必有利于我".
      2. 'imagePrompt': An English image generation prompt describing a complete abstract art picture. 
         Style requirements: "Abstract art, watercolor and ink fusion, fluid organic shapes, soft healing gradients, ethereal atmosphere, high quality, artistic, minimal textures".
         The image should visually represent the emotion of the quote.
    `;

    const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["quote", "imagePrompt"]
        }
      }
    });

    const data = JSON.parse(textResponse.text || '{}');
    const quote = data.quote || "顺境滋养，逆境成长，一切都是体验的礼物";
    const imagePrompt = data.imagePrompt || "Abstract healing art, soft watercolor strokes, ethereal light, organic shapes, comforting colors";

    // 2. Generate the Image
    const imageModel = "gemini-2.5-flash-image";
    
    const imageResponse = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                { text: imagePrompt }
            ]
        },
        config: {
            imageConfig: {
                aspectRatio: "3:4", // Standard card ratio
            }
        }
    });

    let imageUrl = "https://brave.wzznft.com/i/2025/12/27/s8kc8p.png"; // Fallback to one of the user's images

    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
    }

    return {
      id: `ai-${Date.now()}`,
      text: quote,
      imageUrl: imageUrl,
      source: 'ai'
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback to one of the user's images and a default quote
    return {
      id: `fallback-${Date.now()}`,
      text: "凡是发生，必有利于我",
      imageUrl: "https://brave.wzznft.com/i/2025/12/27/s8khg4.png",
      source: 'classic'
    };
  }
};