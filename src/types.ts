export interface VisualBreakdown {
  concept: string;
  mainSubject: string;
  style: string;
  composition: string;
  colorMood: string;
  colorPalette: string[];
  hasNegativeSpace: boolean;
  negativeSpaceNote: string;
}

export interface CommercialAnalysis {
  commercialScore: number;
  commercialPotential: string;
  targetAudience: string[];
  seasonalTrendRelevance: string;
  industryRelevance: string[];
  platformFit: {
    adobeStockTips: string;
    shutterstockTips: string;
  };
}

export interface MicrostockMetadata {
  title: string;
  description: string;
  keywords: string[];
  primaryKeywords: string[];
}

export interface NicheVariation {
  angle: string;
  conceptDescription: string;
  competitionLevel: string;
  demandPotential: string;
  suggestedFormat: string;
}

export interface QualityChecklist {
  titleWordCount: number;
  keywordCount: number;
  trademarkRisk: string;
  commercialTip: string;
}

export interface MicrostockAnalysisResult {
  visualBreakdown: VisualBreakdown;
  commercialAnalysis: CommercialAnalysis;
  metadata: MicrostockMetadata;
  nicheVariations: NicheVariation[];
  qualityChecklist: QualityChecklist;
}

export type TargetPlatform = 'universal' | 'adobe_stock' | 'shutterstock';
export type AssetType = 'auto' | 'vector' | 'photo' | '3d' | 'illustration' | 'background' | 'icon';

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  imageUrl?: string;
  targetPlatform: TargetPlatform;
  assetType: AssetType;
  result: MicrostockAnalysisResult;
}

export interface MarketTrendItem {
  id: string;
  title: string;
  category: string;
  platforms: string[];
  demandScore: number;
  growth: string;
  description: string;
  sampleKeywords: string[];
  lowCompAngle: string;
}

export interface MonthlyNicheAngle {
  title: string;
  description: string;
  competition: string;
  demand: string;
  suggestedFormat: string;
}

export interface MonthTrendData {
  monthIndex: number; // 1 - 12
  monthName: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tagline: string;
  buyerDemandPeak: string[];
  contributorUploadTarget: string[];
  adobeStockFocus: {
    topCategories: string[];
    trendingSearches: string[];
    algorithmTip: string;
  };
  shutterstockFocus: {
    topCategories: string[];
    trendingSearches: string[];
    algorithmTip: string;
  };
  lowCompNicheAngles: MonthlyNicheAngle[];
  curatedKeywords: string[];
}
