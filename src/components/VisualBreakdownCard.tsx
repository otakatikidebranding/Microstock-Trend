import React, { useState } from 'react';
import {
  Eye,
  Palette,
  Layout,
  Layers,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  BookmarkCheck,
} from 'lucide-react';
import { VisualBreakdown } from '../types';

interface VisualBreakdownCardProps {
  breakdown: VisualBreakdown;
  imageUrl?: string | null;
}

export const VisualBreakdownCard: React.FC<VisualBreakdownCardProps> = ({
  breakdown,
  imageUrl,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Breakdown Analisis Visual Kunci</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                Tahap 1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Pembedahan elemen visual untuk kesiapan komersial mikrostock
            </p>
          </div>
        </div>

        {breakdown.hasNegativeSpace && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium self-start sm:self-auto">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Tersedia Copy Space (Disukai Pembeli)</span>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {/* Subjek & Konsep */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Konsep Utama</span>
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {breakdown.concept}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-sky-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Subjek Utama Visual</span>
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {breakdown.mainSubject}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-purple-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Gaya Visual / Art Style</span>
            </span>
            <p className="text-sm font-semibold text-purple-200">
              {breakdown.style}
            </p>
          </div>
        </div>

        {/* Komposisi & Mood Warna */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5" />
              <span>Komposisi &amp; Framing</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {breakdown.composition}
            </p>
            {breakdown.negativeSpaceNote && (
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">Copy space note:</span>
                <span>{breakdown.negativeSpaceNote}</span>
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-rose-400/90 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Mood Warna &amp; Palet Dominan</span>
              </span>
              <p className="text-xs text-slate-200">{breakdown.colorMood}</p>
            </div>

            {/* Color Palette Badges with Click to Copy */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Palet Hex (Klik untuk menyalin):
              </span>
              <div className="flex flex-wrap gap-2">
                {breakdown.colorPalette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyHex(hex)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-200 transition-all active:scale-95 group"
                    title={`Salin ${hex}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: hex }}
                    ></span>
                    <span>{hex}</span>
                    {copiedHex === hex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
