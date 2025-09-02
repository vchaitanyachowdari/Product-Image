import { GoogleGenAI, Modality } from '@google/genai';

import { env , GEMINI_CONFIG } from '@/src/config';
import type { ImagePayload } from '@/types';

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

/**
 * Convert a File object to base64 string with mime type
 */
export const fileToBase64 = (file: File): Promise<ImagePayload> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (!result) {
        reject(new Error('Failed to read file'));
        return;
      }
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Failed to extract base64 data'));
        return;
      }
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Generate in-situ product placement image using Gemini API
 */
export async function generateInSituImage(
  images: ImagePayload[],
  prompt: string
): Promise<string | null> {
  try {
    const imageParts = images.map(image => ({
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    }));

    const textPart = {
      text: `Create a realistic product placement image. ${prompt}. Make sure the products look naturally integrated into the environment with proper lighting, shadows, and perspective.`,
    };

    const response = await ai.models.generateContent({
      model: GEMINI_CONFIG.model,
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        temperature: GEMINI_CONFIG.temperature,
        topP: GEMINI_CONFIG.topP,
        topK: GEMINI_CONFIG.topK,
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error calling Gemini API:', error);
    }
    throw new Error('Failed to generate image with Gemini API.');
  }
}