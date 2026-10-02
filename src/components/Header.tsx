import React from 'react';
import {
  Sparkles,
  TrendingUp,
  History,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { TargetPlatform } from '../types';

interface HeaderProps {
  targetPlatform: TargetPlatform;
  setTargetPlatform: (p: TargetPlatform) => void;
  activeTab: 'visual' | 'monthly_calendar';
  setActiveTab: (tab: 'visual' | 'monthly_calendar') => void;
  onOpenTrends: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  targetPlatform,
  setTargetPlatform,
  activeTab,
  setActiveTab,
  onOpenTrends,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Microstock Trend &amp; Keyword Expert
                </h1>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                  Adobe &amp; Shutterstock
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Riset Tren &amp; Generator Metadata</span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> SEO Optimized
                </span>
              </p>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenTrends}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Market Trends"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenHistory}
              className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Riwayat Analisis"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-bold text-slate-900 flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Analisis Visual vs Tren Bulanan) */}
        <div className="flex items-center p-1 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-semibold w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'visual'
                ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Analisis Visual &amp; Metadata</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly_calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'monthly_calendar'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tren Bulanan</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                activeTab === 'monthly_calendar'
                  ? 'bg-slate-950/20 text-slate-900'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              12 Bulan
            </span>
          </button>
        </div>

        {/* Platform Selector & Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Target platform selector */}
          <div className="flex items-center p-0.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-medium">
            <button
              onClick={() => setTargetPlatform('universal')}
              className={`px-2 py-1 rounded transition-all ${
                targetPlatform === 'universal'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Adobe Stock + Shutterstock"
            >
              Universal
            </button>
            <button
              onClick={() => setTargetPlatform('adobe_stock')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                targetPlatform === 'adobe_stock'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Khusus Adobe Stock"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300"></span>
              Adobe
            </button>
            <button
              onClick={() => setTargetPlatform('shutterstock')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                targetPlatform === 'shutterstock'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Khusus Shutterstock"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
              Shutterstock
            </button>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={onOpenTrends}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Radar Tren</span>
            </button>
            <button
              onClick={onOpenHistory}
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-slate-300" />
              <span>Riwayat ({historyCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

