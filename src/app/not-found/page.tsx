import { getLocale, getTranslations } from 'next-intl/server';
import MotionNotFound from './not-found.client';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function NotFoundPage() {
  return <MotionNotFound />;
}
