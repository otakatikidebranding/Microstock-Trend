import React from 'react';
import {
  Compass,
  Flame,
  ShieldCheck,
  Palette,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NicheVariation } from '../types';

interface NicheVariationsCardProps {
  variations: NicheVariation[];
  onSelectVariation: (variation: NicheVariation) => void;
}

export const NicheVariationsCard: React.FC<NicheVariationsCardProps> = ({
  variations,
  onSelectVariation,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Ide Variasi Visual &amp; Sudut Pandang Unik</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                Low Competition • High Demand
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Rekomendasi pengembangan portofolio untuk menghindari pasar yang sudah jenuh (oversaturated)
            </p>
          </div>
        </div>
      </div>

      {/* Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {variations.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-purple-300 group-hover:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.angle}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{item.competitionLevel}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{item.demandPotential}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.conceptDescription}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-300">{item.suggestedFormat}</span>
              </div>

              <button
                onClick={() => onSelectVariation(item)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>Riset Niche Ini</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
