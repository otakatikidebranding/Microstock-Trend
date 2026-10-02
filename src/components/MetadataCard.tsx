import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Tag,
  Download,
  Search,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { MicrostockMetadata } from '../types';

interface MetadataCardProps {
  metadata: MicrostockMetadata;
  onUpdateMetadata: (newMeta: MicrostockMetadata) => void;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  metadata,
  onUpdateMetadata,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(metadata.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editableDesc, setEditableDesc] = useState(metadata.description);

  // Sync state if metadata props change
  React.useEffect(() => {
    setEditableTitle(metadata.title);
    setEditableDesc(metadata.description);
  }, [metadata]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const titleWords = useMemo(() => {
    return metadata.title.trim().split(/\s+/).filter(Boolean);
  }, [metadata.title]);

  const isTitleValid = titleWords.length >= 5 && titleWords.length <= 10;
  const isKeywordCountValid = metadata.keywords.length >= 30 && metadata.keywords.length <= 50;

  const filteredKeywords = useMemo(() => {
    if (!keywordFilter.trim()) return metadata.keywords;
    return metadata.keywords.filter((kw) =>
      kw.toLowerCase().includes(keywordFilter.toLowerCase().trim())
    );
  }, [metadata.keywords, keywordFilter]);

  const handleSaveTitle = () => {
    onUpdateMetadata({
      ...metadata,
      title: editableTitle.trim(),
    });
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    onUpdateMetadata({
      ...metadata,
      description: editableDesc.trim(),
    });
    setIsEditingDesc(false);
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const updated = metadata.keywords.filter((kw) => kw !== keywordToRemove);
    const updatedPrimary = metadata.primaryKeywords.filter((kw) => kw !== keywordToRemove);
    onUpdateMetadata({
      ...metadata,
      keywords: updated,
      primaryKeywords: updatedPrimary,
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeywordInput.trim().toLowerCase();
    if (!clean) return;
    if (metadata.keywords.includes(clean)) {
      setNewKeywordInput('');
      return;
    }
    onUpdateMetadata({
      ...metadata,
      keywords: [...metadata.keywords, clean],
    });
    setNewKeywordInput('');
  };

  const allKeywordsCommaString = useMemo(() => {
    return metadata.keywords.join(', ');
  }, [metadata.keywords]);

  const top10KeywordsString = useMemo(() => {
    return metadata.keywords.slice(0, 10).join(', ');
  }, [metadata.keywords]);

  const handleExportCSV = () => {
    const csvHeader = 'Filename,Title,Description,Keywords,Categories\n';
    const filename = 'microstock_asset_' + Date.now() + '.jpg';
    const titleEscaped = `"${metadata.title.replace(/"/g, '""')}"`;
    const descEscaped = `"${metadata.description.replace(/"/g, '""')}"`;
    const keywordsEscaped = `"${allKeywordsCommaString.replace(/"/g, '""')}"`;
    const categories = '"Technology / Business"';

    const csvContent = `${csvHeader}${filename},${titleEscaped},${descEscaped},${keywordsEscaped},${categories}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `microstock_metadata_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Metadata Siap Pakai (Adobe Stock &amp; Shutterstock)</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                Tahap 3
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Judul SEO 5–10 kata, deskripsi, dan 30–50 kata kunci terurut sesuai algoritma
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => copyToClipboard(allKeywordsCommaString, 'all_keywords')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            {copiedField === 'all_keywords' ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-950" />
                <span>Salin Semua Keywords ({metadata.keywords.length})</span>
              </>
            )}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Download CSV untuk StockSubmitter atau template Adobe Stock"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="space-y-5 pt-5">
        {/* 1. TITLE SECTION */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Title / Judul (SEO English)
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${
                  isTitleValid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <span>{titleWords.length} Kata</span>
                <span className="font-normal opacity-80">(Standar: 5–10 kata)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isEditingTitle ? (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveTitle}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-semibold"
                >
                  Simpan
                </button>
              )}
              <button
                onClick={() => copyToClipboard(metadata.title, 'title')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-all active:scale-95"
              >
                {copiedField === 'title' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Judul</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!isEditingTitle ? (
            <p className="text-sm font-semibold text-slate-100 select-all tracking-wide">
              {metadata.title}
            </p>
          ) : (
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          )}
        </div>

        {/* 2. DESCRIPTION SECTION */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Description (English)
            </span>
            <div className="flex items-center gap-2">
              {!isEditingDesc ? (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveDesc}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-semibold"
                >
                  Simpan
                </button>
              )}
              <button
                onClick={() => copyToClipboard(metadata.description, 'description')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-all active:scale-95"
              >
                {copiedField === 'description' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Deskripsi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!isEditingDesc ? (
            <p className="text-xs text-slate-300 select-all leading-relaxed">
              {metadata.description}
            </p>
          ) : (
            <textarea
              rows={2}
              value={editableDesc}
              onChange={(e) => setEditableDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          )}
        </div>

        {/* 3. KEYWORDS SECTION */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Keywords (Urut Prioritas)</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isKeywordCountValid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {metadata.keywords.length} Kata Kunci (Target 30–50)
              </span>
            </div>

            {/* Quick sub-copies */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(top10KeywordsString, 'top10_keywords')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 flex items-center gap-1 transition-all"
                title="Adobe Stock memberi bobot tertinggi pada 10 kata kunci pertama"
              >
                {copiedField === 'top10_keywords' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
                <span>Salin Top 10 (Adobe)</span>
              </button>
              <button
                onClick={() => copyToClipboard(allKeywordsCommaString, 'all_comma')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-amber-400 flex items-center gap-1 transition-all"
              >
                {copiedField === 'all_comma' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-amber-400" />
                )}
                <span>Salin Koma</span>
              </button>
            </div>
          </div>

          {/* Search filter & Add Keyword bar */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <form onSubmit={handleAddKeyword} className="flex gap-1.5">
              <input
                type="text"
                placeholder="+ Tambah keyword baru"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                className="w-48 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Interactive Keywords Cloud / Chips */}
          <div className="flex flex-wrap gap-1.5 pt-2 max-h-[280px] overflow-y-auto pr-1">
            {filteredKeywords.map((keyword, index) => {
              const isPrimary = metadata.primaryKeywords.includes(keyword) || index < 10;
              return (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all group ${
                    isPrimary
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-500 select-none">
                    {index + 1}.
                  </span>
                  <span>{keyword}</span>
                  {isPrimary && (
                    <span title="Top Primary Keyword" className="inline-flex items-center">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 ml-0.5" />
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                    title={`Hapus "${keyword}"`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>

          {/* Helper notice */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
            <span>💡 Chip berwarna emas merupakan 10 kata kunci utama penentu peringkat awal di Adobe Stock.</span>
            <span>Klik tombol silang (x) untuk membuang keyword yang tidak diinginkan.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
