"use client";

import { Link } from '@/lib/navigation';
import { Search } from 'lucide-react';

interface SidebarCategory {
  title: string;
  links: { label: string; href: string }[];
}

export function Sidebar({ category }: { category: SidebarCategory }) {
  return (
    <div className="space-y-6">
      {/* Category Navigation */}
      <div className="card-premium dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">{category.title}</h2>
        </div>
        <div className="p-3">
          <ul className="space-y-0.5">
            {category.links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#1a3a8a] dark:hover:text-[#06b6d4] transition-all duration-200 capitalize"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
