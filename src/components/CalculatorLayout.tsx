'use client';

import { Link } from '@/lib/navigation';
import { ChevronRight, Printer } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
}

interface CalculatorLayoutProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function CalculatorLayout({ title, breadcrumbs, children, sidebar }: CalculatorLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <div className="flex justify-between items-center mb-4">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <Link href={crumb.href} className="hover:text-[#1a3a8a] dark:hover:text-[#06b6d4] transition-colors capitalize">
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              )}
            </span>
          ))}
        </nav>
        <button
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a3a8a] dark:hover:text-[#06b6d4] transition-colors"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        {title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <div className="w-full lg:w-72 flex-shrink-0">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
}
