import React, { useEffect, useState } from 'react';
import {
  X,
  TrendingUp,
  Flame,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Tag,
  Calendar,
} from 'lucide-react';
import { MarketTrendItem } from '../types';

interface MarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrend: (trend: MarketTrendItem) => void;
  onOpenMonthlyCalendar?: () => void;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({
  isOpen,
  onClose,
  onSelectTrend,
  onOpenMonthlyCalendar,
}) => {
  const [trends, setTrends] = useState<MarketTrendItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/market-trends')
        .then((res) => res.json())
        .then((data) => {
          if (data.trends) setTrends(data.trends);
        })
        .catch((err) => console.error('Error fetching trends:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Microstock Trend Radar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Market Data
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Kategori dan tema dengan kenaikan permintaan tertinggi di Adobe Stock &amp; Shutterstock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick jump to Monthly Calendar */}
        {onOpenMonthlyCalendar && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-amber-300 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Jadwal upload window &amp; tren musiman lengkap 12 bulan (Januari - Desember)
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenMonthlyCalendar();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors shrink-0 self-start sm:self-auto"
            >
              Buka Kalender 12 Bulan
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
              <div className="w-6 h-6 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
              <span>Memuat tren pasar mikrostock terkini...</span>
            </div>
          ) : (
            trends.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{item.growth}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                      Skor {item.demandScore}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Low competition angle suggestion */}
                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 space-y-0.5">
                  <span className="font-semibold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Sudut Pandang Low-Competition:</span>
                  </span>
                  <p className="text-slate-300 text-[11px]">{item.lowCompAngle}</p>
                </div>

                {/* Keywords preview & action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-1 items-center">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {item.sampleKeywords.slice(0, 4).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                      >
                        {kw}
                      </span>
                    ))}
                    {item.sampleKeywords.length > 4 && (
                      <span className="text-[10px] text-slate-500">
                        +{item.sampleKeywords.length - 4} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onSelectTrend(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all self-end sm:self-auto"
                  >
                    <span>Riset Tren Ini</span>
                    <ArrowRight className="w-3 h-3 text-slate-950" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
