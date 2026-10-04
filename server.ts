import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for body parsing with large payload limit for base64 images
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "40mb" }));

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const microstockResponseSchema = {
  type: Type.OBJECT,
  properties: {
    visualBreakdown: {
      type: Type.OBJECT,
      properties: {
        concept: {
          type: Type.STRING,
          description: "Konsep utama karya (misal: kolaborasi tim remote, keamanan siber, tradisi Ramadan modern, transisi energi hijau)",
        },
        mainSubject: {
          type: Type.STRING,
          description: "Subjek visual primer yang menjadi fokus pandangan utama",
        },
        style: {
          type: Type.STRING,
          description: "Gaya visual spesifik (misal: 3D Isometric Render, Flat Vector Line Art, Editorial Lifestyle Photo, Minimalist Abstract)",
        },
        composition: {
          type: Type.STRING,
          description: "Komposisi dan framing (misal: Rule of thirds, negative copy space di kanan, eye-level angle, clean isolated background)",
        },
        colorMood: {
          type: Type.STRING,
          description: "Mood warna & pencahayaan (misal: High-key modern pastel, deep moody tech neon, vibrant warm festive)",
        },
        colorPalette: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "5 dominant hex color codes in the visual (e.g. #1E293B, #3B82F6, #10B981, #F59E0B, #EC4899)",
        },
        hasNegativeSpace: {
          type: Type.BOOLEAN,
          description: "Apakah memiliki copy space atau area lapang untuk kebutuhan teks desainer grafis",
        },
        negativeSpaceNote: {
          type: Type.STRING,
          description: "Penjelasan copy space atau penempatan teks komersial bagi calon pembeli",
        },
      },
      required: [
        "concept",
        "mainSubject",
        "style",
        "composition",
        "colorMood",
        "colorPalette",
        "hasNegativeSpace",
        "negativeSpaceNote",
      ],
    },
    commercialAnalysis: {
      type: Type.OBJECT,
      properties: {
        commercialScore: {
          type: Type.INTEGER,
          description: "Skor potensi komersial mikrostock dari 1 sampai 100",
        },
        commercialPotential: {
          type: Type.STRING,
          description: "Analisis potensi daya jual di Adobe Stock dan Shutterstock",
        },
        targetAudience: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Daftar target pembeli mikrostock (misal: Agensi Periklanan, UI/UX Designer, Startup Tech, Media Korporat)",
        },
        seasonalTrendRelevance: {
          type: Type.STRING,
          description: "Kesesuaian dengan musim, Q1-Q4 buying cycles, atau event tahunan global/lokal",
        },
        industryRelevance: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Sektor industri yang relevan (Fintech, Healthcare, Education, Green Tech, dll)",
        },
        platformFit: {
          type: Type.OBJECT,
          properties: {
            adobeStockTips: {
              type: Type.STRING,
              description: "Insight & tips khusus algoritma Adobe Stock (relevansi 5 kata pertama judul, Sensei tagging)",
            },
            shutterstockTips: {
              type: Type.STRING,
              description: "Insight & tips khusus algoritma Shutterstock (mCatalog, keyword hierarchy, visual search match)",
            },
          },
          required: ["adobeStockTips", "shutterstockTips"],
        },
      },
      required: [
        "commercialScore",
        "commercialPotential",
        "targetAudience",
        "seasonalTrendRelevance",
        "industryRelevance",
        "platformFit",
      ],
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "SEO-friendly, descriptive microstock title in English, strictly 5-10 words, answering who/what/where/action, zero spam",
        },
        description: {
          type: Type.STRING,
          description: "Brief clear description of the visual elements in English (1-2 sentences)",
        },
        keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Array of exactly 35 to 50 most relevant keywords in English, ordered strictly from highest relevance to secondary context. Single words or 2-word tight phrases.",
        },
        primaryKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 7 to 10 most critical primary search terms that define the core subject",
        },
      },
      required: ["title", "description", "keywords", "primaryKeywords"],
    },
    nicheVariations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          angle: {
            type: Type.STRING,
            description: "Nama sudut pandang atau tema variasi baru",
          },
          conceptDescription: {
            type: Type.STRING,
            description: "Ide visual spesifik yang low-competition dan berpotensi high-demand di pasar",
          },
          competitionLevel: {
            type: Type.STRING,
            description: "Tingkat persaingan (misal: 'Rendah (Low Competition)', 'Sedang-Rendah')",
          },
          demandPotential: {
            type: Type.STRING,
            description: "Potensi permintaan (misal: 'Tinggi (High Demand)', 'Sangat Tinggi')",
          },
          suggestedFormat: {
            type: Type.STRING,
            description: "Format visual yang direkomendasikan (misal: 3D Blender Clay, Flat Monoline SVG, Top-Down Flatlay)",
          },
        },
        required: [
          "angle",
          "conceptDescription",
          "competitionLevel",
          "demandPotential",
          "suggestedFormat",
        ],
      },
      description: "3 sampai 4 rekomendasi variasi visual untuk memperluas portofolio mikrostock",
    },
    qualityChecklist: {
      type: Type.OBJECT,
      properties: {
        titleWordCount: {
          type: Type.INTEGER,
          description: "Jumlah kata pada title (harus antara 5 sampai 10 kata)",
        },
        keywordCount: {
          type: Type.INTEGER,
          description: "Total kata kunci yang dihasilkan (harus antara 35 sampai 50)",
        },
        trademarkRisk: {
          type: Type.STRING,
          description: "Pemeriksaan risiko pelanggaran brand/trademark/intellectual property",
        },
        commercialTip: {
          type: Type.STRING,
          description: "Saran kunci paling actionable untuk meningkatkan CTR dan konversi download",
        },
      },
      required: [
        "titleWordCount",
        "keywordCount",
        "trademarkRisk",
        "commercialTip",
      ],
    },
  },
  required: [
    "visualBreakdown",
    "commercialAnalysis",
    "metadata",
    "nicheVariations",
    "qualityChecklist",
  ],
};

// API Route: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API Route: Analyze Microstock Image / Screenshot
app.post("/api/analyze-stock", async (req, res) => {
  try {
    const {
      image, // { data: base64, mimeType: string }
      promptOrContext,
      targetPlatform = "universal",
      assetType = "auto",
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    if (!image && !promptOrContext) {
      return res.status(400).json({
        error: "Mohon sediakan gambar/screenshot visual atau deskripsi konsep untuk dianalisis.",
      });
    }

    const systemInstruction = `Kamu adalah "Microstock Trend & Keyword Expert", asisten AI paling ahli dan berpengalaman dalam riset tren pasar mikrostock dunia, dengan fokus mendalam pada Adobe Stock dan Shutterstock.

Patuhi aturan kerja berikut dengan sangat disiplin:
1. Analisis Gambar/Visual:
   - Jika diberikan gambar/screenshot, lakukan breakdown elemen visual secara presisi: konsep, subjek utama, gaya visual spesifik (flat vector, isometric 3D render, minimalist photography, clay 3D, oil painting, line art, dsb), komposisi & framing (negative/copy space, rule of thirds, angle), dan mood warna (5 palet hex dominan).
2. Analisis Potensi Komersial & Pasar:
   - Berikan skor potensi komersial (1-100).
   - Identifikasi target pembeli utama (agensi, marketer, startup, edukasi).
   - Tinjau relevansi tren musiman (Q1-Q4, hari raya, holiday seasons, corporate cycle) dan sektor industri.
   - Sediakan tips spesifik untuk algoritma Adobe Stock (faktor 5 kata pertama judul, visual search Sensei) dan Shutterstock (mCatalog, keyword hierarchy).
3. Metadata Siap Pakai (STANDAR INTERNASIONAL MIKROSTOCK):
   - Title: WAJIB dalam bahasa Inggris, SEO-friendly, deskriptif, lugas, STRICTLY 5-10 kata (tidak kurang dari 5, tidak lebih dari 10). Contoh: "Creative Business Team Brainstorming in Modern Office" (7 kata).
   - Description: Penjelasan visual singkat 1-2 kalimat dalam bahasa Inggris yang akurat.
   - Keywords: WAJIB dalam bahasa Inggris, 35–50 keywords paling relevan. Urutkan STRICTLY dari kata kunci paling spesifik/utama ke konteks umum. Bebas dari spam, bebas dari kata terlarang / merek dagang (tanpa kata seperti 'iPhone', 'Adobe', 'Instagram', 'best', 'top', 'image', 'photo').
   - Primary Keywords: 7-10 kata kunci terpenting.
4. Variasi Niche Unik (Low Competition, High Demand):
   - Berikan 3-4 ide variasi visual atau sudut pandang yang belum banyak persaingan namun memiliki kebutuhan komersial tinggi di microstock.
5. Kualitas Output:
   - Bahasa analisis dan penjelasan: Bahasa Indonesia yang lugas, profesional, terstruktur, dan actionable bagi kontributor mikrostock.
   - Metadata (Title, Description, Keywords): WAJIB Bahasa Inggris karena merupakan standar wajib Adobe Stock & Shutterstock bagi pembeli global.`;

    const contentsParts: any[] = [];

    // If image is provided
    if (image && image.data) {
      const cleanBase64 = image.data.replace(/^data:image\/[a-z0-9+]+;base64,/, "");
      const mimeType = image.mimeType || "image/jpeg";

      contentsParts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const userPromptText = `Lakukan analisis mendalam sebagai Microstock Trend & Keyword Expert.

Parameter Analisis:
- Target Platform: ${targetPlatform === "adobe_stock" ? "Khusus Adobe Stock" : targetPlatform === "shutterstock" ? "Khusus Shutterstock" : "Universal (Adobe Stock & Shutterstock)"}
- Estimasi Tipe Aset: ${assetType}
${promptOrContext ? `- Konteks / Catatan Tambahan Kontributor: "${promptOrContext}"` : ""}

${image ? "Analisis visual dari gambar/screenshot yang saya lampirkan di atas. Lakukan breakdown visual secara detail terlebih dahulu sebelum menyajikan metadata dan saran variasi." : "Lakukan riset visual, komersial, metadata, dan variasi niche berdasarkan konsep atau tren berikut."}`;

    contentsParts.push({
      text: userPromptText,
    });

    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ];

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: contentsParts,
            },
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
          const errMsg = err?.message || String(err);
          const isDemandSpike =
            errMsg.includes("503") ||
            errMsg.includes("UNAVAILABLE") ||
            errMsg.includes("high demand") ||
            errMsg.includes("429") ||
            errMsg.includes("RESOURCE_EXHAUSTED");

          console.warn(`[Stock AI] Model ${modelName} (attempt ${attempt}) encountered issue: ${errMsg}`);

          if (isDemandSpike && attempt < 2) {
            await new Promise((r) => setTimeout(r, 1200));
            continue;
          }
          break;
        }
      }

      if (responseText) break;
    }

    if (!responseText) {
      throw lastError || new Error("Layanan model AI sedang mengalami lonjakan beban sesaat. Silakan klik 'Coba Lagi'.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Raw response:", responseText);
      return res.status(500).json({
        error: "Gagal memproses struktur data dari AI. Silakan coba lagi.",
        raw: responseText,
      });
    }

    // Safety fallback for title length and keyword count sanity check
    if (parsedData.metadata?.title) {
      const words = parsedData.metadata.title.trim().split(/\s+/);
      parsedData.qualityChecklist.titleWordCount = words.length;
    }
    if (Array.isArray(parsedData.metadata?.keywords)) {
      parsedData.qualityChecklist.keywordCount = parsedData.metadata.keywords.length;
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error("Error analyzing stock visual:", err);
    return res.status(500).json({
      error: err?.message || "Terjadi kesalahan saat menganalisis visual mikrostock.",
    });
  }
});

// API Route: Curated trend intelligence and market insights
app.get("/api/market-trends", (_req, res) => {
  res.json({
    trends: [
      {
        id: "trend-ai-work",
        title: "AI Integration & Hybrid Workplace 2026",
        category: "Technology & Business",
        platforms: ["Adobe Stock", "Shutterstock"],
        demandScore: 96,
        growth: "+48% YoY",
        description:
          "Visual kolaborasi manusia dengan AI, augmented decision making, cyber resilience, dan automasi proses bisnis modern dengan pencahayaan hangat non-dystopian.",
        sampleKeywords: [
          "artificial intelligence",
          "business automation",
          "future of work",
          "human and ai collaboration",
          "machine learning",
          "digital transformation",
          "smart office",
        ],
        lowCompAngle: "Visual staf senior/non-tech berkolaborasi dengan asisten AI di bidang manufaktur ramah lingkungan.",
      },
      {
        id: "trend-green-energy",
        title: "Sustainable Urban & Circular Economy",
        category: "Environment & Lifestyle",
        platforms: ["Adobe Stock", "Shutterstock"],
        demandScore: 92,
        growth: "+35% YoY",
        description:
          "Panel surya arsitektural, mobilitas listrik mikro, pertanian kota hidroponik, dan kemasan daur ulang estetis dengan palet earth-tone kontemporer.",
        sampleKeywords: [
          "circular economy",
          "urban sustainability",
          "clean technology",
          "zero waste packaging",
          "renewable energy",
          "eco living",
          "green architecture",
        ],
        lowCompAngle: "Infrastruktur daur ulang baterai EV skala komunitas atau sistem smart-grid perumahan tropis.",
      },
      {
        id: "trend-cultural-festive",
        title: "Modern Cultural & Festive Celebrations",
        category: "Culture & Seasonal",
        platforms: ["Adobe Stock", "Shutterstock"],
        demandScore: 89,
        growth: "+62% Q-Peak",
        description:
          "Visual perayaan hari besar (Ramadan, Eid, Imlek, Diwali, Christmas) dengan estetika kontemporer 3D isometric, flat luxury vector, dan keluarga autentik multi-generasi.",
        sampleKeywords: [
          "ramadan kareem",
          "modern islamic celebration",
          "family gathering",
          "festive greetings",
          "contemporary pattern",
          "eid al fitr",
          "cultural unity",
        ],
        lowCompAngle: "Persiapan hidangan buka puasa ramah lingkungan atau tradisi silaturahmi hybrid antar-negara.",
      },
      {
        id: "trend-mental-wellness",
        title: "Micro-Mindfulness & Digital Detox",
        category: "Health & Lifestyle",
        platforms: ["Adobe Stock", "Shutterstock"],
        demandScore: 87,
        growth: "+29% YoY",
        description:
          "Minimalist interior, meditasi singkat di ruang kerja, hobi analog (merajut, berkebun, membaca buku fisik) dengan pencahayaan alami lembut.",
        sampleKeywords: [
          "mindfulness at work",
          "mental wellness",
          "digital detox",
          "calm lifestyle",
          "stress management",
          "analog hobby",
          "self care routine",
        ],
        lowCompAngle: "Pekerja kreatif melakukan jeda 5 menit tanpa layar gadget di taman atap perkantoran.",
      },
    ],
  });
});

// API Route: Monthly Microstock Trend Intelligence (12 Months Calendar)
app.get("/api/monthly-trends", (req, res) => {
  const monthParam = req.query.month;
  res.json({
    currentMonth: new Date().getMonth() + 1,
    queryMonth: monthParam ? parseInt(monthParam as string, 10) : null,
    message: "Monthly microstock trend calendar for Adobe Stock & Shutterstock",
  });
});

// API Route: AI Deep Market Forecast for specific month or theme
app.post("/api/ai-monthly-forecast", async (req, res) => {
  try {
    const { monthIndex, monthName, customFocus } = req.body;
    const targetMonth = monthName || `Bulan ke-${monthIndex || new Date().getMonth() + 1}`;

    const prompt = `Kamu adalah pakar analitik mikrostock kelas dunia (spesialis Adobe Stock & Shutterstock).
Berikan analisis tren mendalam, data pencarian valid, dan peluang niche komersial untuk: ${targetMonth}.
Fokus tambahan (jika ada): ${customFocus || "Peluang kontributor global"}.

Formatkan output dalam JSON valid dengan struktur:
{
  "monthTitle": "${targetMonth}",
  "executiveSummary": "Ringkasan 2 kalimat tentang dinamika pasar mikrostock di bulan ini",
  "buyerDemandFocus": ["Tema 1 yang sedang dicari pembeli", "Tema 2", "Tema 3"],
  "contributorSubmissionWindow": ["Tema 1 yang WAJIB diunggah sekarang untuk 2-3 bulan ke depan", "Tema 2", "Tema 3"],
  "adobeStockInsights": {
    "trendingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "curatedThemes": "Kategori yang paling laris di Adobe Stock bulan ini",
    "senseiTip": "Tips optimasi algoritma Adobe Sensei"
  },
  "shutterstockInsights": {
    "trendingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "curatedThemes": "Kategori yang paling laris di Shutterstock bulan ini",
    "mCatalogTip": "Tips optimasi algoritma Shutterstock mCatalog"
  },
  "highDemandLowCompNiches": [
    {
      "concept": "Judul Konsep Niche",
      "reason": "Mengapa ini laku tapi kompetitornya masih sedikit",
      "recommendedStyle": "3D Isometric / Minimalist Photo / Flat Vector",
      "top5Keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"]
    },
    {
      "concept": "Judul Konsep Niche 2",
      "reason": "Penjelasan peluang pasar",
      "recommendedStyle": "Gaya visual yang disarankan",
      "top5Keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"]
    }
  ]
}`;

    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ];

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Monthly AI Forecast] Error with model ${modelName}:`, err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gagal menghasilkan prediksi tren bulanan.");
    }

    const parsed = JSON.parse(responseText);
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("AI Monthly Forecast error:", err);
    return res.status(500).json({
      error: err?.message || "Terjadi kendala saat memproses prediksi tren AI.",
    });
  }
});

// Vite middleware for development vs static build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Microstock Expert Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
