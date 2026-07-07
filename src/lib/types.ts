export type SEOCategory = 'conversion' | 'finance' | 'health' | 'math' | 'date' | 'statistics';

export interface SEOInput {
  category: SEOCategory;
  type: string; // e.g., 'pressure', 'bmi', 'unit-converter'
  title: string; // Full page title for SEO
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
  jsonLd: object; // JSON‑LD structured data
  breadcrumbs: { name: string; url: string }[];
  related: { name: string; url: string }[];
}
