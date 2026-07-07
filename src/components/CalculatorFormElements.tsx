import React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "input-premium text-sm",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "input-premium text-sm appearance-none bg-no-repeat",
        "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
        className
      )}
      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
      {...props}
    />
  );
}

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      className={cn(
        "btn-primary inline-flex items-center justify-center gap-2 text-sm",
        variant === 'secondary' && "btn-secondary",
        className
      )}
      {...props}
    />
  );
}

export function FormGroup({ children, label, className }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2 mb-3", className)}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:w-36 sm:text-right flex-shrink-0">{label}</label>}
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  );
}

export function FormPanel({ children, header }: { children: React.ReactNode; header?: string }) {
  return (
    <div className="card-premium dark:bg-gray-800 dark:border-gray-700 overflow-hidden mb-6">
      {header && (
        <div className="bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] px-4 py-2">
          <h3 className="text-sm font-semibold text-white">{header}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
