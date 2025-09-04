// FIX: To avoid type conflicts with other libraries and resolve type errors,
// this file uses named imports for Express types (e.g. Request, Response).
// FIX: Aliased Request and Response to ExpressRequest and ExpressResponse to resolve type conflicts with other libraries.
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';
// FIX: To resolve type errors with the global `process` object, `exit` is imported directly.
import { exit } from 'process';


// --- Types and Constants (duplicated from frontend for simplicity) ---
enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
const MODEL_NAME = 'gemini-2.5-flash-image-preview';

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

// --- Server Setup ---
// FIX: Use the named import `Express` to ensure the correct type is used for the app instance.
const app: Express = express();

// Add CORS headers for Safari compatibility
// FIX: Explicitly type `req`, `res`, and `next` to resolve overload errors on `app.use`.
// FIX: Used aliased Express types to fix errors with missing properties on req and res objects.
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '20mb' }));

// Check for API_KEY or GEMINI_API_KEY environment variable
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
  console.error("FATAL: API_KEY or GEMINI_API_KEY environment variable is not set on the server.");
  // FIX: The global `process` object is not correctly typed. Using the imported `exit` function resolves the type error.
  exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

// --- API Router ---
const apiRouter = express.Router();

// The handler is now at '/generate' because it will be mounted under '/api'
// FIX: Use named types `Request` and `Response` for route handlers to resolve type errors.
// FIX: Used aliased Express types to fix errors with missing properties on req and res objects.
apiRouter.post('/generate', async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const { imageBase64, mimeType, gender, suitPrompt, backgroundPrompt, framingPrompt, anglePrompt, expressionPrompt, retouchingPrompt, specialRequest } = req.body;

    const requiredFields: { [key: string]: any } = { imageBase64, mimeType, gender, suitPrompt, backgroundPrompt, framingPrompt, anglePrompt, expressionPrompt, retouchingPrompt };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ error: `Missing required parameter: ${field}` });
      }
    }

    const prompt = buildPrompt(gender, suitPrompt, backgroundPrompt, framingPrompt, anglePrompt, expressionPrompt, retouchingPrompt, specialRequest || '');
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (!part?.inlineData) {
      return res.status(502).json({ error: 'No image was generated by the AI model.' });
    }

    res.json({
      dataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
    });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    res.status(500).json({ error: 'An unexpected error occurred during image generation.', details: error.message });
  }
});

// Mount the API router under the /api path
app.use('/api', apiRouter);


// --- Static File Serving ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve assets from the project root directory where index.html is located.
const publicPath = __dirname;

app.use(express.static(publicPath));

// SPA Fallback: All other GET requests are redirected to index.html
// FIX: Use named types `Request` and `Response` for route handlers to resolve type errors.
// FIX: Used aliased Express types to fix errors with missing properties on req and res objects.
app.get('*', (req: ExpressRequest, res: ExpressResponse) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});