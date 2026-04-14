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
  const CACHE_KEY = `legal_detail_${topicId}_${lang}`;
  const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

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

    if (!ai) throw new Error("AI service not initialized. Please check GEMINI_API_KEY.");

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `You are a legal expert on Slovak law. 
        Your task is to provide accurate, up-to-date legal information. 
        Use the Google Search tool to find the latest changes in Slovak legislation (Slov-Lex, government portals).
        If the search tool is unavailable or fails, use your internal knowledge to provide the most reliable information possible.
        ALWAYS return a valid JSON object following the requested schema. Do not include any text outside the JSON.`,
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
    const details = JSON.parse(text);

    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: details,
      timestamp: Date.now()
    }));

    return details;
  } catch (error) {
    console.error("Error fetching legal details:", error);
    
    // Try to return stale cache if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
    throw error;
  }
}
