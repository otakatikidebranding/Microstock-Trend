import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, Check } from 'lucide-react';
import { QualityChecklist } from '../types';

interface QualityChecklistCardProps {
  checklist: QualityChecklist;
}

export const QualityChecklistCard: React.FC<QualityChecklistCardProps> = ({
  checklist,
}) => {
  const isTitleOk = checklist.titleWordCount >= 5 && checklist.titleWordCount <= 10;
  const isKeywordOk = checklist.keywordCount >= 30 && checklist.keywordCount <= 50;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pre-Flight Checklist &amp; Kualitas Reviewer</span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
              Verifikasi Kirim
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Pemeriksaan otomatis pencegah penolakan (rejection) inspeksi mikrostock
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
        {/* Title length check */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Panjang Judul</span>
            {isTitleOk ? (
              <span className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lolos
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Perhatian
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-100">
            {checklist.titleWordCount} Kata
          </p>
          <p className="text-[11px] text-slate-500">
            {isTitleOk ? 'Ideal 5–10 kata untuk algoritma SEO.' : 'Harus antara 5 sampai 10 kata deskriptif.'}
          </p>
        </div>

        {/* Keyword count check */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Kuantitas Keywords</span>
            {isKeywordOk ? (
              <span className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lolos
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Perlu Disesuaikan
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-100">
            {checklist.keywordCount} Keywords
          </p>
          <p className="text-[11px] text-slate-500">
            {isKeywordOk ? 'Rentang 30–50 kata kunci paling optimal.' : 'Targetkan tepat 30–50 kata kunci.'}
          </p>
        </div>

        {/* Trademark check */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Merek Dagang (IP)</span>
            <span className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" /> Aman
            </span>
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">
            {checklist.trademarkRisk}
          </p>
          <p className="text-[11px] text-slate-500">
            Bebas nama brand, logo komersial, atau spam terms.
          </p>
        </div>
      </div>

      {/* Commercial tip banner */}
      <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300">Tips Peningkatan CTR &amp; Penjualan:</span>
          <p className="text-slate-300 leading-relaxed">{checklist.commercialTip}</p>
        </div>
      </div>
    </div>
  );
};
