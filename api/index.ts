import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "40mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

const microstockResponseSchema = {
  type: Type.OBJECT,
  properties: {
    visualBreakdown: {
      type: Type.OBJECT,
      properties: {
        concept: { type: Type.STRING },
        mainSubject: { type: Type.STRING },
        style: { type: Type.STRING },
        composition: { type: Type.STRING },
        colorMood: { type: Type.STRING },
        colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
        hasNegativeSpace: { type: Type.BOOLEAN },
        negativeSpaceNote: { type: Type.STRING },
      },
      required: ["concept", "mainSubject", "style", "composition", "colorMood", "colorPalette", "hasNegativeSpace", "negativeSpaceNote"],
    },
    commercialAnalysis: {
      type: Type.OBJECT,
      properties: {
        commercialScore: { type: Type.INTEGER },
        commercialPotential: { type: Type.STRING },
        targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
        seasonalTrendRelevance: { type: Type.STRING },
        industryRelevance: { type: Type.ARRAY, items: { type: Type.STRING } },
        platformFit: {
          type: Type.OBJECT,
          properties: {
            adobeStockTips: { type: Type.STRING },
            shutterstockTips: { type: Type.STRING },
          },
          required: ["adobeStockTips", "shutterstockTips"],
        },
      },
      required: ["commercialScore", "commercialPotential", "targetAudience", "seasonalTrendRelevance", "industryRelevance", "platformFit"],
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        primaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "keywords", "primaryKeywords"],
    },
    nicheVariations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          angle: { type: Type.STRING },
          conceptDescription: { type: Type.STRING },
          competitionLevel: { type: Type.STRING },
          demandPotential: { type: Type.STRING },
          suggestedFormat: { type: Type.STRING },
        },
        required: ["angle", "conceptDescription", "competitionLevel", "demandPotential", "suggestedFormat"],
      },
    },
    qualityChecklist: {
      type: Type.OBJECT,
      properties: {
        titleWordCount: { type: Type.INTEGER },
        keywordCount: { type: Type.INTEGER },
        trademarkRisk: { type: Type.STRING },
        commercialTip: { type: Type.STRING },
      },
      required: ["titleWordCount", "keywordCount", "trademarkRisk", "commercialTip"],
    },
  },
  required: ["visualBreakdown", "commercialAnalysis", "metadata", "nicheVariations", "qualityChecklist"],
};

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
});

router.post("/analyze-stock", async (req, res) => {
  try {
    const { image, promptOrContext, targetPlatform = "universal", assetType = "auto" } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY belum dikonfigurasi di Environment Variables server." });
    }
    if (!image && !promptOrContext) {
      return res.status(400).json({ error: "Mohon sediakan gambar/screenshot visual atau deskripsi konsep untuk dianalisis." });
    }

    const systemInstruction = `Kamu adalah "Microstock Trend & Keyword Expert", asisten AI paling ahli dalam riset tren pasar mikrostock Adobe Stock dan Shutterstock.
1. Analisis Visual: breakdown konsep, subjek utama, gaya visual, komposisi/framing, copy space, dan 5 warna hex.
2. Analisis Komersial: skor 1-100, target pembeli, tren musiman, tips Adobe Stock & Shutterstock.
3. Metadata Standar Internasional:
   - Title: WAJIB Bahasa Inggris, deskriptif, SEO-friendly, STRICTLY 5-10 kata.
   - Description: 1-2 kalimat Bahasa Inggris akurat.
   - Keywords: WAJIB Bahasa Inggris, 35-50 keywords paling relevan terurut dari primer ke umum, zero spam/trademark.
   - Primary Keywords: 7-10 kata kunci terpenting.
4. Niche Variations: 3-4 ide visual variasi low competition, high demand.
5. Kualitas: Analisis & penjelasan dalam Bahasa Indonesia. Metadata (Title, Description, Keywords) WAJIB Bahasa Inggris.`;

    const contentsParts: any[] = [];
    if (image && image.data) {
      const cleanBase64 = image.data.replace(/^data:image\/[a-z0-9+]+;base64,/, "");
      contentsParts.push({
        inlineData: {
          mimeType: image.mimeType || "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    const userPromptText = `Lakukan analisis mendalam sebagai Microstock Trend & Keyword Expert.
Parameter:
- Target Platform: ${targetPlatform}
- Estimasi Tipe Aset: ${assetType}
${promptOrContext ? `- Konteks: "${promptOrContext}"` : ""}
${image ? "Analisis visual gambar di atas." : "Riset konsep tren berikut."}`;

    contentsParts.push({ text: userPromptText });

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: contentsParts },
            config: {
              systemInstruction,
              temperature: 0.35,
              responseMimeType: "application/json",
              responseSchema: microstockResponseSchema,
            },
          });
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          break;
        }
      }
      if (responseText) break;
    }

    if (!responseText) throw lastError || new Error("Gagal menghasilkan analisis AI.");
    const parsedData = JSON.parse(responseText);
    if (parsedData.metadata?.title) {
      parsedData.qualityChecklist.titleWordCount = parsedData.metadata.title.trim().split(/\s+/).length;
    }
    if (Array.isArray(parsedData.metadata?.keywords)) {
      parsedData.qualityChecklist.keywordCount = parsedData.metadata.keywords.length;
    }

    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error("Analysis error:", err);
    return res.status(500).json({ error: err?.message || "Terjadi kesalahan internal saat analisis AI." });
  }
});

router.get("/daily-trends", (_req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    trends: [
      { id: "trend-cybersecurity", title: "Cybersecurity & Data Privacy", category: "Technology & Business", platforms: ["Adobe Stock", "Shutterstock"], demandScore: 94, growth: "+48% YoY", description: "Visual 3D isometric & vector tentang keamanan siber, enkripsi cloud, dan perlindungan privasi data.", sampleKeywords: ["cybersecurity", "data protection", "cloud security", "cyber defense", "network safety"], lowCompAngle: "Visual simulasi audit keamanan siber dengan elemen UI analitik holografik." },
      { id: "trend-sustainability", title: "Clean Energy Transition & ESG", category: "Environment & Industry", platforms: ["Adobe Stock", "Shutterstock"], demandScore: 91, growth: "+36% YoY", description: "Ilustrasi panel surya modern, turbin angin lepas pantai, dan smart-city ramah lingkungan.", sampleKeywords: ["green energy", "solar panel", "renewable power", "sustainability", "eco friendly"], lowCompAngle: "Infrastruktur daur ulang baterai EV skala komunitas." },
      { id: "trend-cultural-festive", title: "Modern Cultural & Festive Celebrations", category: "Culture & Seasonal", platforms: ["Adobe Stock", "Shutterstock"], demandScore: 89, growth: "+62% Q-Peak", description: "Visual perayaan hari besar (Ramadan, Eid, Imlek, Diwali, Christmas) dengan estetika kontemporer 3D isometric.", sampleKeywords: ["ramadan kareem", "modern celebration", "family gathering", "festive greetings"], lowCompAngle: "Persiapan hidangan buka puasa ramah lingkungan atau silaturahmi hybrid." },
      { id: "trend-mental-wellness", title: "Micro-Mindfulness & Digital Detox", category: "Health & Lifestyle", platforms: ["Adobe Stock", "Shutterstock"], demandScore: 87, growth: "+29% YoY", description: "Minimalist interior, meditasi singkat di ruang kerja, dan hobi analog dengan pencahayaan alami lembut.", sampleKeywords: ["mindfulness at work", "mental wellness", "digital detox", "calm lifestyle"], lowCompAngle: "Pekerja kreatif melakukan jeda 5 menit tanpa layar gadget di taman atap." }
    ]
  });
});

router.get("/monthly-trends", (req, res) => {
  const monthParam = req.query.month;
  res.json({
    currentMonth: new Date().getMonth() + 1,
    queryMonth: monthParam ? parseInt(monthParam as string, 10) : new Date().getMonth() + 1,
    leadTimeRecommendation: "Unggah karya 60-90 hari sebelum momen puncak perayaan.",
    seasons: [
      { id: "season-ramadan", name: "Ramadan & Idul Fitri", peakMonths: [2, 3, 4], targetUploadWindow: "November - Januari", keywords: ["ramadan kareem", "eid mubarak", "ketupat illustration", "mosque pattern"], platforms: ["Adobe Stock", "Shutterstock"] },
      { id: "season-halloween", name: "Halloween & Fall Autumn", peakMonths: [9, 10], targetUploadWindow: "Juni - Agustus", keywords: ["halloween party", "spooky background", "autumn leaves", "pumpkin patch"], platforms: ["Adobe Stock", "Shutterstock"] },
      { id: "season-christmas", name: "Christmas & New Year Holidays", peakMonths: [11, 12], targetUploadWindow: "Agustus - Oktober", keywords: ["christmas celebration", "happy new year", "winter holiday", "festive gift"], platforms: ["Adobe Stock", "Shutterstock"] }
    ]
  });
});

app.use("/api", router);
app.use("/", router);

export default app;
