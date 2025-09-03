
import { GoogleGenAI, Modality } from "@google/genai";
import type { Gender } from '../types';

// Converts a File object to a base64 string.
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]); // Return only the base64 part
    reader.onerror = (error) => reject(error);
  });
};

const buildPrompt = (
  gender: Gender,
  suitPrompt: string,
  backgroundPrompt: string,
  framingPrompt: string,
  anglePrompt: string,
  expressionPrompt: string,
  retouchingPrompt: string,
  specialRequest: string
): string => {
  const specialRequestSection = specialRequest.trim()
    ? `- **Special Retouching Request:** ${specialRequest.trim()}\n`
    : '';

  return `You are an expert photo editor. Transform the user's photo into a professional headshot suitable for a resume.

**Strict Rules:**
1. **Identity Preservation & Retouching:** ${retouchingPrompt} The person's core identity MUST be preserved.
2. **Facial Expression:** ${expressionPrompt}
3. **Natural Appearance:** Avoid any excessive or unrealistic airbrushing. The final image must look natural and authentic based on the requested retouching level.
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
${specialRequestSection}- **Final Composition:** A natural, business-style portrait with the specified framing and angle.

Generate only the edited image. Do not output any text.`;
};


export const generateResumePhoto = async (
  imageFile: File,
  gender: Gender,
  suitPrompt: string,
  backgroundPrompt: string,
  framingPrompt: string,
  anglePrompt: string,
  expressionPrompt: string,
  retouchingPrompt: string,
  specialRequest: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const imageBase64 = await fileToBase64(imageFile);
    const prompt = buildPrompt(gender, suitPrompt, backgroundPrompt, framingPrompt, anglePrompt, expressionPrompt, retouchingPrompt, specialRequest);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: imageFile.type } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    // If no image part is found
    throw new Error('AI 모델로부터 이미지를 생성하지 못했습니다.');

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    // Provide a user-friendly error message for the frontend to display
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('사진 생성에 실패했습니다: API 키가 유효하지 않습니다.');
    }
    throw new Error('사진 생성에 실패했습니다. 잠시 후 다시 시도하거나, 다른 사진을 사용해보세요.');
  }
};