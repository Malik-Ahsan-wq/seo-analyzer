export type CWV = {
  lcp?: { value: number; displayValue?: string };
  cls?: { value: number; displayValue?: string };
  inp?: { value: number; displayValue?: string };
};

export type PSIResult = {
  performance?: number;
  seo?: number;
  accessibility?: number;
  bestPractices?: number;
  cwv?: CWV;
  raw?: unknown;
};

export type OnPageReport = {
  title?: string;
  titleLength?: number;
  metaDescription?: string;
  metaDescriptionLength?: number;
  h1Count: number;
  h2Count: number;
  imagesMissingAlt: Array<{ src?: string; alt?: string }>;
  canonical?: string | null;
  robots?: string | null;
  openGraph: Record<string, string>;
  score: number; // 0-100
  recommendations: string[];
};

export type AnalyzeResult = {
  url: string;
  psi: {
    mobile: PSIResult;
    desktop: PSIResult;
  };
  onpage: OnPageReport;
  seoScore: number;
};
