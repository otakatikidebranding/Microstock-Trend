import React from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  Briefcase,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { CommercialAnalysis } from '../types';

interface CommercialAnalysisCardProps {
  analysis: CommercialAnalysis;
}

export const CommercialAnalysisCard: React.FC<CommercialAnalysisCardProps> = ({
  analysis,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Potensi Komersial &amp; Target Pasar</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                Tahap 2
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi daya jual aset dan kesesuaian ekosistem mikrostock global
            </p>
          </div>
        </div>

        {/* Commercial Score Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] uppercase font-mono text-slate-400">Skor Komersial</p>
            <p className="text-xs font-semibold text-slate-200">Daya Jual Pasar</p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-xl border text-base font-black flex items-center gap-1.5 ${getScoreColor(
              analysis.commercialScore
            )}`}
          >
            <Award className="w-4 h-4" />
            <span>{analysis.commercialScore}</span>
            <span className="text-xs font-normal opacity-70">/100</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {/* Left: Commercial potential & Target Audience */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Daya Tarik Komersial</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {analysis.commercialPotential}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Target Pembeli (Audiens)</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.targetAudience.map((audience, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-sky-950/50 border border-sky-800/50 text-sky-300 text-xs font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-sky-400" />
                  <span>{audience}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Seasonal Trend & Industry Sectors */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Relevansi Tren Musiman / Event Siklus</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {analysis.seasonalTrendRelevance}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Sektor Industri Pengguna</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.industryRelevance.map((industry, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-800/50 text-purple-300 text-xs font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Algorithm Guidance */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Kesesuaian Algoritma Platform</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Tips Algoritma Adobe Stock (Sensei)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {analysis.platformFit.adobeStockTips}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1">
            <div className="font-semibold text-red-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Tips Algoritma Shutterstock (mCatalog)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {analysis.platformFit.shutterstockTips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
