import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Flame,
  Palette,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { MONTHLY_TREND_CALENDAR, getCurrentMonthIndex } from '../data/monthlyTrendCalendar';
import { MonthTrendData, MonthlyNicheAngle } from '../types';

interface MonthlyTrendSectionProps {
  onApplyTrendConcept: (conceptText: string, suggestedFormat?: string) => void;
}

export const MonthlyTrendSection: React.FC<MonthlyTrendSectionProps> = ({
  onApplyTrendConcept,
}) => {
  const currentRealMonth = getCurrentMonthIndex();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentRealMonth);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [aiForecastLoading, setAiForecastLoading] = useState(false);
  const [aiForecastData, setAiForecastData] = useState<any | null>(null);

  const activeMonthData: MonthTrendData =
    MONTHLY_TREND_CALENDAR.find((m) => m.monthIndex === selectedMonthIndex) ||
    MONTHLY_TREND_CALENDAR[0];

  const handleCopyKeywords = (keywords: string[]) => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2200);
  };

  const handleFetchAiForecast = async () => {
    setAiForecastLoading(true);
    try {
      const res = await fetch('/api/ai-monthly-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthIndex: activeMonthData.monthIndex,
          monthName: activeMonthData.monthName,
        }),
      });
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(rawText || `Server error (${res.status})`);
      }
      if (data.success) {
        setAiForecastData(data.data);
      }
    } catch (e) {
      console.error('Error fetching AI forecast:', e);
    } finally {
      setAiForecastLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl space-y-6 relative overflow-hidden">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Kalender Tren Bulanan Mikrostock
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Adobe Stock &amp; Shutterstock Verified
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                12 Bulan Lengkap
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jadwal emas pengunggahan kontributor (upload window 2–3 bulan sebelumnya) vs puncak pembelian aktual agensi global
            </p>
          </div>
        </div>

        {/* AI Forecast button */}
        <button
          onClick={handleFetchAiForecast}
          disabled={aiForecastLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 shrink-0 self-start lg:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>
            {aiForecastLoading
              ? 'Memindai Algoritma AI...'
              : `Prediksi AI Mendalam (${activeMonthData.monthName})`}
          </span>
        </button>
      </div>

      {/* Month Selector Bar (12 Months) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Pilih Bulan Riset:</span>
          <span className="text-[11px] text-slate-500">
            *Bulan dengan titik hijau adalah bulan saat ini
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {MONTHLY_TREND_CALENDAR.map((month) => {
            const isSelected = month.monthIndex === selectedMonthIndex;
            const isCurrent = month.monthIndex === currentRealMonth;
            return (
              <button
                key={month.monthIndex}
                onClick={() => {
                  setSelectedMonthIndex(month.monthIndex);
                  setAiForecastData(null); // Reset custom forecast on month switch
                }}
                className={`px-2 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all border relative ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-102 z-10'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{month.monthName.slice(0, 3)}</span>
                  {isCurrent && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-slate-950' : 'bg-emerald-400 animate-pulse'
                      }`}
                      title="Bulan Sekarang"
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase font-mono ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {month.quarter}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Month Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-black">
              {activeMonthData.monthName} ({activeMonthData.quarter})
            </span>
            {activeMonthData.monthIndex === currentRealMonth && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Bulan Berjalan
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white tracking-wide">
            {activeMonthData.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyKeywords(activeMonthData.curatedKeywords)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            {copiedKeywords ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Salin Keywords ({activeMonthData.curatedKeywords.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two Pillars: Contributor Upload Window vs Buyer Demand Peak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Window (Most Critical for Microstockers) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Jendela Kirim Kontributor (Upload Window)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Wajib Unggah Sekarang
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Algoritma butuh 4–8 minggu untuk indexing dan menaikkan ranking visual. Kirim tema ini sekarang untuk menyambut lonjakan belanja 2–3 bulan mendatang:
          </p>
          <ul className="space-y-2 pt-1">
            {activeMonthData.contributorUploadTarget.map((target, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-200 font-medium p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1">{target}</span>
                <button
                  onClick={() => onApplyTrendConcept(`Tema Upload Musiman: ${target}`)}
                  className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors shrink-0"
                  title="Buat metadata untuk tema ini"
                >
                  <span>Buat Metadata</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Buyer Demand Peak */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Puncak Pembelian Pembeli (Buyer Demand)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Top Download Sekarang
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Kebutuhan kampanye iklan dan proyek kreatif yang sedang dibeli massal oleh agensi dan korporat di bulan {activeMonthData.monthName}:
          </p>
          <ul className="space-y-2 pt-1">
            {activeMonthData.buyerDemandPeak.map((demand, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-200 font-medium p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1">{demand}</span>
                <button
                  onClick={() => onApplyTrendConcept(`Tren Pembelian Aktif: ${demand}`)}
                  className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors shrink-0"
                  title="Riset tema pembeli ini"
                >
                  <span>Riset Tema</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Platform Comparison Breakdown: Adobe Stock vs Shutterstock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adobe Stock Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Adobe Stock Intelligence (Bulan {activeMonthData.monthName})
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Sensei Driven</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Kategori Terlaris:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeMonthData.adobeStockFocus.topCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-200 text-[11px]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium">Kata Kunci Pencarian Melonjak:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeMonthData.adobeStockFocus.trendingSearches.map((search, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-[11px] text-rose-200 leading-relaxed">
              <span className="font-bold text-rose-300">Tips Algoritma Sensei: </span>
              <span>{activeMonthData.adobeStockFocus.algorithmTip}</span>
            </div>
          </div>
        </div>

        {/* Shutterstock Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-red-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                Shutterstock Intelligence (Bulan {activeMonthData.monthName})
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">mCatalog Driven</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Kategori Terlaris:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeMonthData.shutterstockFocus.topCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-red-950/40 border border-red-800/40 text-red-200 text-[11px]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium">Kata Kunci Pencarian Melonjak:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeMonthData.shutterstockFocus.trendingSearches.map((search, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-[11px] text-red-200 leading-relaxed">
              <span className="font-bold text-red-300">Tips Algoritma Shutterstock: </span>
              <span>{activeMonthData.shutterstockFocus.algorithmTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Competition Niche Opportunities for this Month */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              Peluang Niche Emas Bulan {activeMonthData.monthName} (Low Competition • High Demand)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Peluang karya cepat laku tanpa terbentur jutaan kompetitor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeMonthData.lowCompNicheAngles.map((niche: MonthlyNicheAngle, index: number) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{niche.competition}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{niche.demand}</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-purple-200 group-hover:text-purple-100 transition-colors">
                  {niche.title}
                </h4>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {niche.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-slate-500" />
                  <span>{niche.suggestedFormat}</span>
                </span>

                <button
                  onClick={() =>
                    onApplyTrendConcept(
                      `Riset Niche Bulan ${activeMonthData.monthName}: ${niche.title}. Konsep: ${niche.description}`,
                      niche.suggestedFormat
                    )
                  }
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>Gunakan Ide Ini</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Real-time Deep Forecast Section (if triggered) */}
      {aiForecastData && (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-800/50 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Prediksi AI Real-Time: {aiForecastData.monthTitle}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              Live Algorithmic Forecast
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {aiForecastData.executiveSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            {aiForecastData.highDemandLowCompNiches?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/80 border border-purple-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">{item.concept}</span>
                  <span className="text-[10px] text-slate-400">{item.recommendedStyle}</span>
                </div>
                <p className="text-[11px] text-slate-300">{item.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {item.top5Keywords?.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() =>
                    onApplyTrendConcept(
                      `Riset Prediksi AI Bulan ${activeMonthData.monthName}: ${item.concept}. Rekomendasi: ${item.recommendedStyle}`
                    )
                  }
                  className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Terapkan Sebagai Input Analisis</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
