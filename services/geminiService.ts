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
    const imageBase64 = await fileToBase64(imageFile);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType: imageFile.type,
        gender,
        suitPrompt,
        backgroundPrompt,
        framingPrompt,
        anglePrompt,
        expressionPrompt,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        // Log the detailed error for debugging, but show a user-friendly message.
        console.error('Server error:', errorData);
        throw new Error(`사진 생성에 실패했습니다. (서버 오류: ${response.status})`);
    }

    const result = await response.json();
    if (!result.dataUrl) {
        throw new Error('서버로부터 유효한 이미지를 받지 못했습니다.');
    }

    return result.dataUrl;

  } catch (error) {
    console.error('Error generating image via server:', error);
    if (error instanceof Error) {
        // Re-throw with a more user-friendly prefix if it's not one of our custom messages.
        if (!error.message.startsWith('사진 생성에 실패했습니다')) {
             throw new Error(`사진 생성에 실패했습니다. 네트워크 연결을 확인해주세요.`);
        }
        throw error; // Re-throw our custom errors
    }
    // Fallback for non-Error exceptions.
    throw new Error('사진 생성에 실패했습니다. 알 수 없는 오류가 발생했습니다.');
  }
};