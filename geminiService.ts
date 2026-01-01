import { GoogleGenAI, Type } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY as string
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandName, niche, goals } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
You are a world-class growth marketing consultant for Elevate Creatives.

Brand: ${brandName}
Niche: ${niche}
Goals: ${goals}

Provide a structured growth strategy focusing on Agentic AI.
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projectedGrowth: { type: Type.STRING }
          },
          required: [
            'headline',
            'summary',
            'recommendations',
            'projectedGrowth'
          ]
        }
      }
    });

    const text = response.text ?? '{}'; // ✅ FIX #2
    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: 'Failed to generate audit' });
  }
}
