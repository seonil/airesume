
import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_NAME } from '../constants';
import type { Gender } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const buildPrompt = (
  gender: Gender,
  suitPrompt: string,
  backgroundPrompt: string,
  framingPrompt: string,
  anglePrompt: string,
  expressionPrompt: string
): string => {
  return `You are an expert photo editor. Transform the user's photo into a professional headshot suitable for a resume.

**Strict Rules:**
1. **Identity Preservation:** The person's core facial features (eyes, nose, bone structure) and hairstyle MUST remain completely unchanged. You are forbidden from altering their fundamental identity.
2. **Facial Expression:** ${expressionPrompt}
3. **Natural Appearance:** Avoid any excessive or unrealistic skin smoothing, airbrushing, or other facial modifications. The final image must look natural and authentic.
4. **Focus on Clothing, Background, and Composition:** Your primary tasks are:
   - Replace the existing clothing with the specified formal attire.
   - Replace the background with the specified color.
   - ${anglePrompt}
   - ${framingPrompt}
5. **Realistic Integration:** The new clothing must be seamlessly blended. Pay close attention to the neckline, shadows, and lighting to match the original photo.

**User's Request:**
- **Gender of Person in Photo:** ${gender}
- **Desired Attire:** ${suitPrompt}
- **Desired Background:** ${backgroundPrompt}
- **Final Composition:** A natural, business-style portrait with the specified framing and angle.

Generate only the edited image. Do not output any text.`;
};



export const generateResumePhoto = async (
  imageFile: File,
  gender: Gender,
  suitPrompt: string,
  backgroundPrompt: string,
  framingPrompt: string,
  anglePrompt: string,
  expressionPrompt: string
): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: buildPrompt(gender, suitPrompt, backgroundPrompt, framingPrompt, anglePrompt, expressionPrompt) };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error('No image was generated in the response.');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate photo. Please check your API key and try again.');
  }
};
