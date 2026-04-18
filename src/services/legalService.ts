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
      3a. For the "civil-rights" topic, MUST include:
         - Fundamental rights and freedoms based on the Constitution of the Slovak Republic (Ústava SR).
         - Protections under the Slovak Civil Code (Občiansky zákonník - Act No. 40/1964).
         - Specific rights of foreigners at the SR and EU level (Charter of Fundamental Rights of the EU).
         - Obligations of foreigners derived from their residency type (Act No. 404/2011).
         - Mention how LiVia Integra assistance ensures these rights are respected and obligations met.
      3b. For the "human-rights" topic, MUST include:
         - Fundamental human rights and freedoms from the Constitution of the Slovak Republic (Ústava SR).
         - European Convention on Human Rights (ECHR) and EU Charter of Fundamental Rights.
         - Specific EU Directives and Regulations on anti-discrimination, gender equality, and protection of vulnerable groups.
         - International treaties ratified by SR: Convention on the Rights of the Child (OSN), Istanbul Convention (if relevant context), etc.
         - Focus on protection of children, women, and prevention of discrimination for both EU and 3rd country nationals.
         - Explain that these are directly applicable in SR and how we help navigate institutional compliance.
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
        Specifically for Civil Rights, consult the Constitution (Ústava SR) and the Civil Code (Občiansky zákonník).
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
      'civil-rights': {
        title: lang === 'en' ? 'Civil Rights & Obligations' : 'Občianske práva a povinnosti',
        sections: [
          {
            title: lang === 'en' ? 'Constitutional Foundations' : 'Ústavné základy',
            content: lang === 'en'
              ? 'Foreigners in the Slovak Republic enjoy fundamental rights and freedoms guaranteed by the Constitution (Ústava SR). These rights are interpreted in harmony with international treaties and EU law.'
              : 'Cudzinci v Slovenskej republike požívajú základné práva a slobody garantované Ústavou SR. Tieto práva sú interpretované v súlade s medzinárodnými zmluvami a právom EÚ.',
            items: [
              lang === 'en' ? 'Right to legal protection (Constitution)' : 'Právo na právnu ochranu (Ústava)',
              lang === 'en' ? 'Inviolability of the person' : 'Nedotknuteľnosť osoby',
              lang === 'en' ? 'Right to property (Slovak Civil Code)' : 'Právo vlastniť majetok (Občiansky zákonník)'
            ]
          },
          {
            title: lang === 'en' ? 'Duties & Obligations' : 'Povinnosti a záväzky',
            content: lang === 'en'
              ? 'With rights come duties. Depending on your residency type (Act No. 404/2011), you have specific notification duties toward the Foreign Police and legal obligations under the Slovak Civil Code.'
              : 'S právami prichádzajú aj povinnosti. V závislosti od vášho typu pobytu (zákon č. 404/2011) máte špecifické ohlasovacie povinnosti voči cudzineckej polícii a právne záväzky podľa Občianskeho zákonníka.',
            items: [
              lang === 'en' ? 'Address registration and status changes' : 'Hlásenie zmien a pobytu',
              lang === 'en' ? 'Valid travel document and compliance' : 'Dodržiavanie platnosti dokladov',
              lang === 'en' ? 'Legal adherence to SR/EU framework' : 'Dodržiavanie právneho poriadku SR/EÚ'
            ]
          },
          {
            title: lang === 'en' ? 'Strategic Legal Safeguarding' : 'Strategická právna ochrana',
            content: lang === 'en'
              ? 'At LiVia Integra, we specialize in bridging the gap between basic rights and complex institutional requirements. We ensure your status is shielded against administrative discrepancies.'
              : 'V LiVia Integra sa špecializujeme na premosťovanie práv a komplexných inštitucionálnych požiadaviek. Zabezpečíme, aby bol váš status chránený pred administratívnymi nezrovnalosťami.',
            items: [
              lang === 'en' ? 'Direct liaison with Slovak institutions' : 'Koordinácia s inštitúciami v SR',
              lang === 'en' ? 'Charter of Fundamental Rights compliance' : 'Súlad s Chartou základných práv EÚ',
              lang === 'en' ? 'Personalized legal roadmap' : 'Osobný plán právnych krokov'
            ]
          }
        ],
        legalActs: [
          { name: 'Constitution of the Slovak Republic', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/1992/460/' },
          { name: 'Act No. 40/1964 Civil Code', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/1964/40/' },
          { name: 'Charter of Fundamental Rights of the EU', url: 'https://eur-lex.europa.eu/legal-content/SK/TXT/?uri=CELEX:12012P/TXT' }
        ]
      },
      'human-rights': {
        title: lang === 'en' ? 'Superior Human Rights Protection' : 'Nadštandardná ochrana ľudských práv',
        sections: [
          {
            title: lang === 'en' ? 'International Conventions & SR Law' : 'Medzinárodné dohovory a právo SR',
            content: lang === 'en'
              ? 'Human rights are the core of our legal identity. We navigate the intricate overlap between the SR Constitution, the European Convention on Human Rights (ECHR), and UN treaties to ensure absolute protection for you and your family.'
              : 'Ľudské práva sú jadrom našej právnej identity. Navigujeme v zložitom prekrytí Ústavy SR, Európskeho dohovoru o ľudských právach (EDĽP) a zmlúv OSN, aby sme zabezpečili absolútnu ochranu pre vás a vašu rodinu.',
            items: [
              lang === 'en' ? 'Direct application of international treaties' : 'Priama aplikovateľnosť medzinárodných zmlúv',
              lang === 'en' ? 'Constitutional complaint strategies' : 'Stratégie ústavných sťažností',
              lang === 'en' ? 'EU Charter rights enforcement' : 'Uplatňovanie práv Charty EÚ'
            ]
          },
          {
            title: lang === 'en' ? 'Protection of Women & Children' : 'Ochrana žien a detí',
            content: lang === 'en'
              ? 'Specific protections under the Convention on the Rights of the Child and EU Gender Equality Directives are non-negotiable. We ensure that your family’s rights are prioritized in every administrative interaction.'
              : 'Špecifická ochrana podľa Dohovoru o právach dieťaťa a smerníc EÚ o rodovej rovnosti je nepopierateľná. Zabezpečujeme, aby práva vašej rodiny boli prioritou v každej administratívnej interakcii.',
            items: [
              lang === 'en' ? 'Child rights advocacy' : 'Advokácia práv dieťaťa',
              lang === 'en' ? 'Anti-discrimination framework (EU level)' : 'Antidiskriminačný rámec (úroveň EÚ)',
              lang === 'en' ? 'Vulnerable group legal shielding' : 'Právna ochrana zraniteľných skupín'
            ]
          },
          {
            title: lang === 'en' ? 'Zero-Tolerance Discrimination Support' : 'Nulová tolerancia diskriminácie',
            content: lang === 'en'
              ? 'Whether facing institutional bias or private sector hurdles, the Slovak and EU anti-discrimination acts provide powerful tools. Our high-level liaison ensures your dignity and rights remain untouched.'
              : 'Či už čelíte inštitucionálnej predpojatosti alebo prekážkam v súkromnom sektore, slovenské a európske antidiskriminačné zákony poskytujú silné nástroje. Naša koordinácia chráni vašu dôstojnosť.',
            items: [
              lang === 'en' ? 'Anti-discrimination act navigation' : 'Navigácia v antidiskriminačnom zákone',
              lang === 'en' ? 'Equal treatment representation' : 'Zastupovanie v otázkach rovnakého zaobchádzania',
              lang === 'en' ? 'Strategic institutional shielding' : 'Strategická inštitucionálna ochrana'
            ]
          }
        ],
        legalActs: [
          { name: 'Convention on the Rights of the Child', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/1991/104/' },
          { name: 'European Convention on Human Rights', url: 'https://www.echr.coe.int/documents/d/echr/convention_slk' },
          { name: 'Act No. 365/2004 Antidiskriminačný zákon', url: 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/365/' }
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
