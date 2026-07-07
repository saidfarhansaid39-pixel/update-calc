import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export function constructMetadata({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-image.png',
}: SEOProps): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl || 'https://www.jdcalc.com',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl || 'https://www.jdcalc.com',
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
}
