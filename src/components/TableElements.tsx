import React from 'react';
import { cn } from '@/lib/utils';

export function CompactTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className={cn("w-full text-right border-collapse text-[13px] bg-white border border-[#cccccc]", className)}>
        {children}
      </table>
    </div>
  );
}

export function CompactTableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead>
      <tr className={cn("bg-[#3366aa] text-white", className)}>
        {children}
      </tr>
    </thead>
  );
}

export function CompactTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function CompactTh({ children, className, align = 'center' }: { children: React.ReactNode; className?: string; align?: 'left'|'center'|'right' }) {
  return (
    <th className={cn("p-[3px] font-normal border border-[#cccccc]", `text-${align}`, className)}>
      {children}
    </th>
  );
}

export function CompactTd({ children, className, align = 'right', colSpan }: { children: React.ReactNode; className?: string; align?: 'left'|'center'|'right'; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={cn("p-[3px] border border-[#e0e0e0]", `text-${align}`, className)}>
      {children}
    </td>
  );
}

export function CompactTr({ children, className, isEven }: { children: React.ReactNode; className?: string; isEven?: boolean }) {
  return (
    <tr className={cn(isEven ? "bg-[#f8f8f8]" : "", className)}>
      {children}
    </tr>
  );
}
