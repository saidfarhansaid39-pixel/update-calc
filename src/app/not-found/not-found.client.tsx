'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Zap, AlertTriangle, RefreshCw, Smartphone } from 'lucide-react';

export default function MotionNotFound() {
  const t = useTranslations('notFound');
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-md">
        <div className="inline-block">
          <Zap className="h-12 w-12 text-amber-400 mb-4" />
          <AlertTriangle className="h-10 w-10 text-amber-300 mb-2" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          404
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {t('heading')}
        </p>

        <p className="text-sm text-gray-500 max-w-xl">
          {t('message')}
        </p>

        <a
          href="/"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          <Smartphone className="h-5 w-5" />
          {t('goHome')}
          <RefreshCw className="h-4 w-4 ml-2" />
        </a>

        <p className="text-xs text-gray-400 mt-8">
          {t('redirectNotice', { seconds: countdown })}
        </p>
      </div>
    </div>
  );
}
