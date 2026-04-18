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
      Provide professional legal information for foreigners in Slovakia regarding the topic: "${topicId}".
      
      CRITICAL INSTRUCTIONS:
      1. Use a "BAIT/HOOK" approach. Do NOT explain the full procedures. 
      2. Mention relevant laws (e.g., Act No. 404/2011) and key institutions involved (e.g., Foreign Police, Ministry of Interior, Labor Office).
      3. For the "residency" topic, MUST include sections for:
         - Students (Štúdium)
         - Employment/Work (Zamestnanie)
         - Business (Podnikanie)
         - Family Reunification (Zlúčenie rodiny)
         - Permanent Residence (Trvalý pobyt)
         - Special Activities (Osobitná činnosť - art, sport, volunteering)
      4. Each section should highlight a "complexity" or "benefit" (e.g., "Strategic advantage for firms", "Simplified process for top talent") to motivate the user to contact us for a full consultation.
      5. The tone should be high-level, professional, and slightly "exclusive".
      6. Language: ${lang === 'sk' ? 'Slovak' : 'English'}.
      
      Return the data in the following JSON format:
      {
        "title": "Topic Title",
        "sections": [
          { "title": "Section Title", "content": "The 'hook' text mentioning laws/institutions but keeping full details for consultation.", "items": ["Benefit 1", "Specific Law Reference", "Target Group"] }
        ],
        "legalActs": [
          { "name": "Law Name", "url": "https://..." }
        ]
      }
    `;

    if (!ai) throw new Error("AI service not initialized. Please check GEMINI_API_KEY.");

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        systemInstruction: `You are a legal expert on Slovak law. 
        Your task is to provide accurate, up-to-date legal information. 
        Use the Google Search tool to find the latest changes in Slovak legislation (Slov-Lex, government portals).
        If the search tool is unavailable or fails, use your internal knowledge to provide the most reliable information possible.
        ALWAYS return a valid JSON object following the requested schema. Do not include any markdown formatting or text outside the JSON.`,
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
    
    // Clean potential markdown formatting
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const details = JSON.parse(cleanText);

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

    // Hardcoded fallbacks for reliability
    const fallbacks: Record<string, LegalTopicDetail> = {
      residency: {
        title: lang === 'en' ? 'Exclusive Residency Navigation' : 'Exkluzívna navigácia pobytov',
        sections: [
          {
            title: lang === 'en' ? 'Strategic Business Residency' : 'Strategický pobyt za účelom podnikania',
            content: lang === 'en' 
              ? 'Navigating Act No. 404/2011 requires precision. For foreign entrepreneurs and firms, the interplay between the Ministry of Interior and specific labor regulations can decide the timeline of your market entry.' 
              : 'Navigácia v zákone č. 404/2011 vyžaduje precíznosť. Pre zahraničných podnikateľov a firmy môže súhra medzi Ministerstvom vnútra a špecifickými pracovnými predpismi rozhodnúť o časovom harmonograme vášho vstupu na trh.',
            items: [
              lang === 'en' ? 'Corporate strategy optimization' : 'Optimalizácia korporátnej stratégie',
              lang === 'en' ? 'Inter-institutional liaison' : 'Koordinácia medzi inštitúciami',
              lang === 'en' ? 'Targeted for high-net-worth entities' : 'Zamerané na subjekty s vysokou pridanou hodnotou'
            ]
          },
          {
            title: lang === 'en' ? 'Employment & Talent Integration' : 'Zamestnanie a integrácia talentov',
            content: lang === 'en'
              ? 'The path from labor market analysis to a successful residence permit is paved with strict documentation requirements. We bridge the gap between firms and the Labor Office (ÚPSVaR).'
              : 'Cesta od analýzy trhu práce k úspešnému povoleniu na pobyt je dláždená prísnymi dokumentačnými požiadavkami. Premosťujeme priepasť medzi firmami a úradmi práce (ÚPSVaR).',
            items: [
              lang === 'en' ? 'Blue Card advantages' : 'Výhody Modrej karty',
              lang === 'en' ? 'Single permit complexities' : 'Komplexnosť jednotného povolenia',
              lang === 'en' ? 'Strategic hiring support' : 'Podpora pri strategickom nábore'
            ]
          },
          {
            title: lang === 'en' ? 'Academic & Special Activities' : 'Akademické a osobitné činnosti',
            content: lang === 'en'
              ? 'Students and specialists (art, sports, volunteering) face unique regulatory hurdles. Managing the transition to other stay types later is where early strategy pays off.'
              : 'Študenti a špecialisti (umenie, šport, dobrovoľníctvo) čelia jedinečným regulačným prekážkam. Správne nastavenie prechodu na iné typy pobytov je miesto, kde sa včasná stratégia vyplatí.',
            items: [
              lang === 'en' ? 'Specialized legal anchors' : 'Špecializované právne ukotvenia',
              lang === 'en' ? 'Future status planning' : 'Plánovanie budúceho statusu',
              lang === 'en' ? 'Institutional compliance' : 'Inštitucionálny compliance'
            ]
          }
        ],
        legalActs: [
          { name: 'Act No. 404/2011 on Residence of Aliens', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2011/404/' },
          { name: 'Act No. 5/2004 on Employment Services', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/5/' }
        ]
      },
      labor: {
        title: lang === 'en' ? 'Premium Labor Advisory' : 'Prémiové pracovnoprávne poradenstvo',
        sections: [
          {
            title: lang === 'en' ? 'Contractual Shielding' : 'Zmluvné štíty',
            content: lang === 'en'
              ? 'The Labor Code (Act No. 311/2001) protects, but also binds. For international firms, standard contracts often fail to address specific cross-border complexities.'
              : 'Zákonník práce (zákon č. 311/2001) chráni, ale aj zaväzuje. Pre medzinárodné firmy štandardné zmluvy často nedokážu ošetriť špecifické cezhraničné komplexnosti.',
            items: [
              lang === 'en' ? 'Customized liability clauses' : 'Doložky o zodpovednosti na mieru',
              lang === 'en' ? 'Regulatory compliance audits' : 'Audity súladu s predpismi',
              lang === 'en' ? 'Labor Office mediation' : 'Mediácia s úradmi práce'
            ]
          }
        ],
        legalActs: [
          { name: 'Act No. 311/2001 Labor Code', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2001/311/' }
        ]
      }
    };

    return fallbacks[topicId] || fallbacks['residency'];
  }
}
