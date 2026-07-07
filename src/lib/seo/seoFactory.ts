import { Metadata } from 'next';
import {
  buildCanonicalUrl,
  generateKeywords,
  buildBreadcrumbs,
  buildJsonLd,
  BreadcrumbItem,
  RelatedCalculator
} from './seoHelpers';

export interface SeoFactoryInput {
  category: string;
  type: string;
  title: string;
  description?: string;
  relatedCalculators: RelatedCalculator[];
}

export interface ExtendedMetadata extends Metadata {
  breadcrumbs: BreadcrumbItem[];
  relatedCalculators: RelatedCalculator[];
  jsonLd: any;
}

export function seoFactory(input: SeoFactoryInput): ExtendedMetadata {
  const { category, type, title, description: customDescription, relatedCalculators } = input;

  const canonicalUrl = buildCanonicalUrl(category, type);
  const keywords = generateKeywords(category, type);
  
  const defaultDescription = `Free online ${title} to compute results with high precision. Deterministic calculations, simple inputs, and clear explanation.`;
  const description = customDescription || defaultDescription;

  const jsonLd = buildJsonLd({
    title,
    description,
    canonicalUrl,
    category
  });

  const ogImage = `/og-image.png`; // Default OG image path

  const baseMetadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };

  const breadcrumbs = buildBreadcrumbs(category, type, title);

  return {
    ...baseMetadata,
    breadcrumbs,
    relatedCalculators,
    jsonLd,
  };
}
