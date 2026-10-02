import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Clipboard,
  X,
  Sliders,
  FileText,
  AlertCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';
import { AssetType, TargetPlatform } from '../types';

interface UploadZoneProps {
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  setImageData: (data: { data: string; mimeType: string } | null) => void;
  assetType: AssetType;
  setAssetType: (type: AssetType) => void;
  promptOrContext: string;
  setPromptOrContext: (text: string) => void;
  targetPlatform: TargetPlatform;
  onStartAnalysis: () => void;
  isLoading: boolean;
  loadingStep: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  imagePreview,
  setImagePreview,
  setImageData,
  assetType,
  setAssetType,
  promptOrContext,
  setPromptOrContext,
  targetPlatform,
  onStartAnalysis,
  isLoading,
  loadingStep,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global clipboard listener for quick pasting of screenshots from Shutterstock / Adobe Stock
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            setPasteNotice('Tangkapan layar berhasil ditempel dari Clipboard!');
            setTimeout(() => setPasteNotice(null), 3000);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Format file harus berupa gambar (JPG, PNG, WEBP, atau SVG).');
      return;
    }

    // For SVGs, read as dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        const match = result.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          setImageData({ mimeType: match[1], data: match[2] });
        } else {
          setImageData({ mimeType: 'image/svg+xml', data: result.replace(/^data:[^;]+;base64,/, '') });
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // For bitmaps (JPG, PNG, WEBP), downsample if width/height > 1600px
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setImagePreview(optimizedDataUrl);
          const base64Data = optimizedDataUrl.replace(/^data:image\/jpeg;base64,/, '');
          setImageData({
            mimeType: 'image/jpeg',
            data: base64Data,
          });
        } else {
          setImagePreview(rawDataUrl);
          setImageData({
            mimeType: file.type || 'image/jpeg',
            data: rawDataUrl.replace(/^data:[^;]+;base64,/, ''),
          });
        }
      };
      img.onerror = () => {
        setImagePreview(rawDataUrl);
        setImageData({
          mimeType: file.type || 'image/jpeg',
          data: rawDataUrl.replace(/^data:[^;]+;base64,/, ''),
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SamplePreset) => {
    setImagePreview(sample.dataUrl);
    setAssetType(sample.assetType);
    setPromptOrContext(sample.notes);

    const match = sample.dataUrl.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
    if (match) {
      setImageData({
        mimeType: match[1],
        data: match[2],
      });
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col lg:flex-row gap-6 items-start relative z-10">
        {/* Left Column: Image Dropzone & Preview */}
        <div className="w-full lg:w-7/12 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Visual Referensi / Screenshot Pasar</span>
            </label>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Bisa langsung <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] text-amber-300">Ctrl+V</kbd> paste screenshot</span>
            </span>
          </div>

          {pasteNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pasteNotice}</span>
            </div>
          )}

          {/* Uploader Box */}
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[240px] group ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
                  : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-950/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-amber-400 group-hover:scale-105 transition-all shadow-inner mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
                Drag &amp; drop gambar, atau <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-4">pilih file dari perangkat</span>
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Unggah karya visual, screenshot top seller Adobe Stock / Shutterstock, atau moodboard referensi (PNG, JPG, WEBP, SVG)
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 p-2 overflow-hidden group">
              <div className="relative w-full h-[260px] sm:h-[300px] rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Visual Preview"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={handleClearImage}
                  disabled={isLoading}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-500 text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg"
                  title="Hapus gambar"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-medium border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Visual Siap Dianalisis
                </div>
              </div>
            </div>
          )}

          {/* Sample Preset Chooser */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Atau pilih sampel top-seller siap uji:</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRESETS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700/50">
                    <img
                      src={sample.dataUrl}
                      alt={sample.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-300">
                      {sample.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">
                      {sample.assetType} • {sample.category.split('&')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Start Button */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Parameter Optimasi Mikrostock</span>
          </div>

          {/* Asset Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Tipe Visual Aset</span>
              <span className="text-[11px] text-slate-500 font-normal">Membantu targeting keyword</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'auto', label: 'Otomatis' },
                { id: 'vector', label: 'Vector / Flat' },
                { id: '3d', label: '3D Render' },
                { id: 'photo', label: 'Foto / Real' },
                { id: 'illustration', label: 'Ilustrasi Art' },
                { id: 'background', label: 'Background' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAssetType(item.id as AssetType)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                    assetType === item.id
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes or Custom Focus */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Catatan / Niche Konteks (Opsional)</span>
              <span className="text-[11px] text-slate-500 font-normal">Contoh: Ramadan, ESG, B2B</span>
            </label>
            <textarea
              rows={3}
              value={promptOrContext}
              onChange={(e) => setPromptOrContext(e.target.value)}
              placeholder="Contoh: Fokuskan keyword untuk pembeli korporat perbankan, atau prioritaskan sudut pandang tren musiman Q1..."
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/60 focus:border-amber-500/60 transition-colors resize-none"
            />
          </div>

          {/* Microstock rules summary box */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Standar Metadata Adobe Stock &amp; Shutterstock:</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
              <li>Judul SEO bahasa Inggris deskriptif: <strong>5–10 kata</strong></li>
              <li>Keywords bahasa Inggris: <strong>30–50 kata kunci terurut</strong></li>
              <li>Zero spam, tanpa merek dagang berlisensi (IP safe)</li>
            </ul>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-1">
            <button
              onClick={onStartAnalysis}
              disabled={isLoading || (!imagePreview && !promptOrContext.trim())}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading
                  ? 'bg-amber-500/30 text-amber-200 cursor-wait border border-amber-500/40'
                  : !imagePreview && !promptOrContext.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin"></div>
                  <span>{loadingStep || 'Menganalisis Visual & Tren Pasar...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Mulai Analisis Visual &amp; Riset Tren</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
