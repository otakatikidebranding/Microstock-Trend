import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { VisualBreakdownCard } from './components/VisualBreakdownCard';
import { CommercialAnalysisCard } from './components/CommercialAnalysisCard';
import { MetadataCard } from './components/MetadataCard';
import { NicheVariationsCard } from './components/NicheVariationsCard';
import { QualityChecklistCard } from './components/QualityChecklistCard';
import { MarketTrendsModal } from './components/MarketTrendsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { MonthlyTrendSection } from './components/MonthlyTrendSection';
import { MONTHLY_TREND_CALENDAR, getCurrentMonthIndex } from './data/monthlyTrendCalendar';
import {
  MicrostockAnalysisResult,
  TargetPlatform,
  AssetType,
  HistoryItem,
  MarketTrendItem,
  NicheVariation,
  MicrostockMetadata,
} from './types';
import {
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Download,
  Share2,
  Check,
  ChevronDown,
  Calendar,
  ArrowRight,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'microstock_analysis_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visual' | 'monthly_calendar'>('visual');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ data: string; mimeType: string } | null>(null);
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('universal');
  const [assetType, setAssetType] = useState<AssetType>('auto');
  const [promptOrContext, setPromptOrContext] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<MicrostockAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isTrendsOpen, setIsTrendsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const currentRealMonth = getCurrentMonthIndex();
  const currentMonthData = MONTHLY_TREND_CALENDAR.find((m) => m.monthIndex === currentRealMonth) || MONTHLY_TREND_CALENDAR[0];

  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: HistoryItem) => {
    try {
      const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 30);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Yakin ingin menghapus semua riwayat analisis?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Perform Gemini Multimodal Analysis
  const handleStartAnalysis = async () => {
    if (!imageData && !promptOrContext.trim()) {
      setErrorMessage('Sediakan gambar/screenshot atau masukkan deskripsi konsep.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('1/4 Mengunggah visual & membedah komposisi...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('2/4 Menganalisis potensi komersial & audiens mikrostock...');
    }, 2500);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('3/4 Meracik title SEO 5–10 kata & 30–50 keywords relevan...');
    }, 5000);

    const stepTimer3 = setTimeout(() => {
      setLoadingStep('4/4 Menemukan celah niche low-competition & pre-flight check...');
    }, 7500);

    try {
      const response = await fetch('/api/analyze-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          promptOrContext,
          targetPlatform,
          assetType,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal memproses analisis mikrostock.');
      }

      const result: MicrostockAnalysisResult = resData.data;
      setAnalysisResult(result);

      // Save to history
      const historyItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: Date.now(),
        title: result.metadata?.title || 'Microstock Analysis',
        imageUrl: imagePreview || undefined,
        targetPlatform,
        assetType,
        result,
      };
      saveToHistory(historyItem);

      // Smooth scroll to results
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err?.message || 'Terjadi kesalahan saat memproses data. Silakan coba lagi.'
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setImagePreview(item.imageUrl || null);
    setTargetPlatform(item.targetPlatform);
    setAssetType(item.assetType);
    setAnalysisResult(item.result);
    setErrorMessage(null);

    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSelectTrend = (trend: MarketTrendItem) => {
    setPromptOrContext(
      `Riset Tren: "${trend.title}". Kategori: ${trend.category}. Angle: ${trend.lowCompAngle}`
    );
    // Suggest asset type
    setAssetType('vector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVariation = (variation: NicheVariation) => {
    setPromptOrContext(
      `Variasi Niche: "${variation.angle}". Deskripsi: ${variation.conceptDescription}. Rekomendasi Format: ${variation.suggestedFormat}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMetadata = (newMeta: MicrostockMetadata) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      metadata: newMeta,
      qualityChecklist: {
        ...analysisResult.qualityChecklist,
        titleWordCount: newMeta.title.trim().split(/\s+/).filter(Boolean).length,
        keywordCount: newMeta.keywords.length,
      },
    });
  };

  const handleCopyFullReport = () => {
    if (!analysisResult) return;
    const reportText = `=== MICROSTOCK METADATA & TREND REPORT ===
Platform: ${targetPlatform.toUpperCase()}
Title (${analysisResult.qualityChecklist.titleWordCount} words): ${analysisResult.metadata.title}

Description:
${analysisResult.metadata.description}

Keywords (${analysisResult.metadata.keywords.length} tags):
${analysisResult.metadata.keywords.join(', ')}

--- VISUAL BREAKDOWN ---
Concept: ${analysisResult.visualBreakdown.concept}
Main Subject: ${analysisResult.visualBreakdown.mainSubject}
Art Style: ${analysisResult.visualBreakdown.style}
Composition: ${analysisResult.visualBreakdown.composition}
Color Mood: ${analysisResult.visualBreakdown.colorMood}
Color Palette: ${analysisResult.visualBreakdown.colorPalette.join(', ')}

--- COMMERCIAL VIABILITY ---
Commercial Score: ${analysisResult.commercialAnalysis.commercialScore}/100
Potential: ${analysisResult.commercialAnalysis.commercialPotential}
Target Buyers: ${analysisResult.commercialAnalysis.targetAudience.join(', ')}
Seasonal Trend: ${analysisResult.commercialAnalysis.seasonalTrendRelevance}
Industries: ${analysisResult.commercialAnalysis.industryRelevance.join(', ')}

--- LOW COMPETITION NICHE VARIATIONS ---
${analysisResult.nicheVariations.map((v, i) => `${i + 1}. ${v.angle} (${v.competitionLevel} / ${v.demandPotential})\n   Concept: ${v.conceptDescription}\n   Format: ${v.suggestedFormat}`).join('\n')}
`;

    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleApplyTrendConcept = (conceptText: string, suggestedFormat?: string) => {
    setPromptOrContext(conceptText);

    if (suggestedFormat) {
      const lower = suggestedFormat.toLowerCase();
      if (lower.includes('vector') || lower.includes('svg')) {
        setAssetType('vector');
      } else if (lower.includes('photo') || lower.includes('flatlay') || lower.includes('lifestyle')) {
        setAssetType('photo');
      } else if (lower.includes('3d') || lower.includes('render') || lower.includes('isometric')) {
        setAssetType('3d');
      } else if (lower.includes('illustration')) {
        setAssetType('illustration');
      }
    }

    setActiveTab('visual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setImagePreview(null);
    setImageData(null);
    setAnalysisResult(null);
    setPromptOrContext('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <Header
        targetPlatform={targetPlatform}
        setTargetPlatform={setTargetPlatform}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTrends={() => setIsTrendsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Conditional View Based on Active Tab */}
        {activeTab === 'monthly_calendar' ? (
          <section className="space-y-6 animate-fadeIn">
            <MonthlyTrendSection onApplyTrendConcept={handleApplyTrendConcept} />
          </section>
        ) : (
          <>
            {/* Quick Seasonal Trend Banner for Current Month */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900/90 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      Riset Tren Bulan Ini ({currentMonthData.monthName}):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Upload Window: {currentMonthData.contributorUploadTarget[0]?.split('(')[0] || 'Musim Mendatang'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-none">
                    Pembeli Adobe Stock &amp; Shutterstock sedang mencari:{' '}
                    <span className="text-slate-200 font-medium">
                      {currentMonthData.buyerDemandPeak.slice(0, 3).join(' • ')}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('monthly_calendar')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shrink-0 self-start sm:self-auto"
              >
                <span>Lihat Kalender 12 Bulan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upload and Parameter Zone */}
            <section>
              <UploadZone
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setImageData={setImageData}
                assetType={assetType}
                setAssetType={setAssetType}
                promptOrContext={promptOrContext}
                setPromptOrContext={setPromptOrContext}
                targetPlatform={targetPlatform}
                onStartAnalysis={handleStartAnalysis}
                isLoading={isLoading}
                loadingStep={loadingStep}
              />
            </section>
          </>
        )}

        {/* Error Alert with Quick Retry */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-rose-200">
                  {errorMessage.includes('503') || errorMessage.includes('demand') || errorMessage.includes('lonjakan')
                    ? 'Antrean Trafik Model AI Sesaat (503)'
                    : 'Terjadi Kendala Teknis'}
                </span>
                <p className="text-rose-300/90 text-xs leading-relaxed">
                  {errorMessage.includes('503') || errorMessage.includes('demand') || errorMessage.includes('lonjakan')
                    ? 'Model AI sedang mengalami lonjakan trafik singkat. Silakan klik tombol di samping untuk mencoba kembali secara otomatis dengan model cadangan.'
                    : errorMessage}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95 shrink-0 self-end sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi Sekarang</span>
            </button>
          </div>
        )}

        {/* Results Presentation (Strictly ordered: Visual Breakdown -> Commercial -> Metadata -> Variations -> Checklist) */}
        {analysisResult && (
          <section ref={resultSectionRef} className="space-y-6 animate-fadeIn pt-2">
            {/* Action Bar for Contributor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Hasil Riset Pasar &amp; Metadata Siap Kirim
                  </h3>
                  <p className="text-xs text-slate-400">
                    Optimasi untuk {targetPlatform === 'universal' ? 'Adobe Stock & Shutterstock' : targetPlatform === 'adobe_stock' ? 'Adobe Stock' : 'Shutterstock'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyFullReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Laporan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Ringkasan Laporan</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Mulai analisis karya baru"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Analisis Baru</span>
                </button>
              </div>
            </div>

            {/* 1. Visual Breakdown Card (First per explicit prompt instruction) */}
            <VisualBreakdownCard
              breakdown={analysisResult.visualBreakdown}
              imageUrl={imagePreview}
            />

            {/* 2. Commercial & Market Analysis Card */}
            <CommercialAnalysisCard
              analysis={analysisResult.commercialAnalysis}
            />

            {/* 3. Ready-To-Use Metadata Card (Title, Description, 30-50 Keywords) */}
            <MetadataCard
              metadata={analysisResult.metadata}
              onUpdateMetadata={handleUpdateMetadata}
            />

            {/* 4. Niche Variations Card (Low Competition, High Demand) */}
            <NicheVariationsCard
              variations={analysisResult.nicheVariations}
              onSelectVariation={handleSelectVariation}
            />

            {/* 5. Pre-flight Quality & Policy Checklist */}
            <QualityChecklistCard
              checklist={analysisResult.qualityChecklist}
            />
          </section>
        )}
      </main>

      {/* Market Trends Modal */}
      <MarketTrendsModal
        isOpen={isTrendsOpen}
        onClose={() => setIsTrendsOpen(false)}
        onSelectTrend={handleSelectTrend}
        onOpenMonthlyCalendar={() => setActiveTab('monthly_calendar')}
      />

      {/* Saved History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span className="font-semibold text-slate-400">Microstock Trend &amp; Keyword Expert</span>
            <span>— Adobe Stock &amp; Shutterstock Intelligence Engine</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Standar metadata: Judul 5–10 kata • 30–50 keywords terurut • Zero trademark violation
          </p>
        </div>
      </footer>
    </div>
  );
}
