import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface LegalTopicDetail {
  title: string;
  sections: {
    title: string;
    content: string;
    items?: string[];
  }[];
  legalActs: {
    name: string;
    url: string;
  }[];
}

export async function fetchLegalTopicDetails(topicId: string, lang: 'en' | 'sk'): Promise<LegalTopicDetail> {
  const prompt = `
    Provide detailed, professional, and up-to-date legal information for foreigners in Slovakia regarding the topic: "${topicId}".
    
    Structure the response for two main groups:
    1. EU/EEA/Swiss Citizens (Občania EÚ/EHP/Švajčiarska)
    2. Third-Country Nationals (Štátni príslušníci tretích krajín)
    
    For "residency", include all types of stays (temporary, permanent, tolerated).
    For "labor", include employment rights, types of work permits, and business-based stays.
    For "civil-rights", include fundamental rights, human rights, the Charter of Fundamental Rights of the EU, and documents related to integration and migration in Slovakia.
    For "human-rights", include fundamental human rights and freedoms, children's rights (Convention on the Rights of the Child), and international treaties/conventions Slovakia is bound by.
    
    The tone should be professional and empathetic.
    Language: ${lang === 'sk' ? 'Slovak' : 'English'}.
    
    Include a list of the most relevant current Slovak laws (e.g., Act No. 404/2011 on Residence of Aliens).
    CRITICAL: For each law, provide a direct URL to the official consolidated text on Slov-Lex (slov-lex.sk) or a similar official government source. Ensure the URLs are valid and point to the current version.
    
    Return the data in the following JSON format:
    {
      "title": "Topic Title",
      "sections": [
        { "title": "Section Title", "content": "Introductory text", "items": ["Point 1", "Point 2"] }
      ],
      "legalActs": [
        { "name": "Law Name", "url": "https://..." }
      ]
    }
  `;

  try {
    if (!ai) throw new Error("AI service not initialized. Please check GEMINI_API_KEY.");

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "content"]
              }
            },
            legalActs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            }
          },
          required: ["title", "sections", "legalActs"]
        }
      }
    });

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching legal details:", error);
    throw error;
  }
}
