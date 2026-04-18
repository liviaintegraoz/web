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

export async function fetchLatestSlovakLegalNews(lang: 'en' | 'sk' = 'en'): Promise<NewsItem[]> {
  const CACHE_KEY = `slovak_legal_news_cache_${lang}`;
  const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    if (!ai) throw new Error("AI service not initialized");

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Get the 5 most recent and important legal updates, social insurance changes, health insurance updates, and integration news for foreigners in Slovakia. Language: ${lang === 'sk' ? 'Slovak' : 'English'}. Provide them in a structured JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `You are a news curator specializing in Slovak legal and social updates for foreigners. 
        Use Google Search to find news from the last 30 days. 
        Focus on official sources like the Ministry of Interior, Social Insurance Agency (Sociálna poisťovňa), and major Slovak news outlets.
        Language: ${lang === 'sk' ? 'Slovak' : 'English'}.
        If search fails, provide the most recent known updates from your internal database in the requested language.
        ALWAYS return a valid JSON array. Do not include any markdown formatting or text outside the JSON.`,
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
    
    // Clean potential markdown formatting
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const news = JSON.parse(cleanText);

    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: news,
      timestamp: Date.now()
    }));

    return news;
  } catch (error) {
    console.error("Error fetching news from Gemini:", error);
    
    // Try to return stale cache if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }

    const fallbacks = {
      en: [
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
      ],
      sk: [
        {
          title: "Aktualizácia sociálneho poistenia 2026",
          summary: "Nové sadzby príspevkov a oznamovacie povinnosti pre SZČO cudzincov od tohto štvrťroka.",
          category: "Právo",
          date: "2026-04-01",
          imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Zmeny v zdravotnom poistení",
          summary: "Rozšírené krytie pre medzinárodných odborníkov a ich rodinných príslušníkov v rámci verejného systému.",
          category: "Zdravie",
          date: "2026-03-25",
          imageUrl: "https://images.unsplash.com/photo-1505751172107-5739a00723b5?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Spustený nový portál pobytov",
          summary: "Ministerstvo vnútra spustilo nový digitálny portál na zefektívnenie žiadostí o pobyt.",
          category: "Integrácia",
          date: "2026-03-15",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Novela Zákonníka práce",
          summary: "Objasnenie zmlúv o práci na diaľku pre zamestnancov pracujúcich pre zahraničné subjekty zo Slovenska.",
          category: "Právo",
          date: "2026-03-05",
          imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Granty na komunitnú integráciu",
          summary: "Nové finančné prostriedky pre mimovládne organizácie zamerané na budovanie komunít.",
          category: "Komunita",
          date: "2026-02-20",
          imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
        }
      ]
    };

    return fallbacks[lang];
  }
}
