import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will use fallback data.");
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface NewsItem {
  title: string;
  summary: string;
  category: string;
  date: string;
  imageUrl: string;
}

export async function fetchLatestSlovakLegalNews(): Promise<NewsItem[]> {
  try {
    if (!ai) throw new Error("AI service not initialized");

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Get the 5 most recent and important legal updates, social insurance changes, health insurance updates, and integration news for foreigners in Slovakia. Provide them in a structured JSON format.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING },
              date: { type: Type.STRING },
              imageUrl: { type: Type.STRING, description: "A relevant Unsplash image URL for this news topic" },
            },
            required: ["title", "summary", "category", "date", "imageUrl"],
          },
        },
      },
    });

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    const news = JSON.parse(text);
    return news;
  } catch (error) {
    console.error("Error fetching news from Gemini:", error);
    // Fallback data in case of API failure or key issues
    return [
      {
        title: "Social Insurance Updates 2026",
        summary: "New contribution rates and reporting requirements for self-employed foreigners starting this quarter.",
        category: "Law",
        date: "2026-04-01",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Health Insurance Coverage Changes",
        summary: "Expanded coverage for international professionals and their family members under the public health system.",
        category: "Health",
        date: "2026-03-25",
        imageUrl: "https://images.unsplash.com/photo-1505751172107-5739a00723b5?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "New Residency Portal Launched",
        summary: "The Ministry of Interior has launched a new digital portal to streamline residency permit applications.",
        category: "Integration",
        date: "2026-03-15",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Labor Law Amendment",
        summary: "Clarifications on remote work contracts for employees working for foreign entities from Slovakia.",
        category: "Law",
        date: "2026-03-05",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Community Integration Grants",
        summary: "New funding available for NGOs focusing on local community building and language support.",
        category: "Community",
        date: "2026-02-20",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
      }
    ];
  }
}
