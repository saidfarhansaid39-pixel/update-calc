import { getHubTheme } from '@/lib/hub-themes';
import * as Icons from 'lucide-react';
import * as React from 'react';

export function HubIcon({ slug, className }: { slug: string; className?: string }) {
  const theme = getHubTheme(slug);
  const Icon = (Icons as any)[theme.icon] || Icons.Calculator;
  return <Icon className={className} style={{ color: theme.accent }} />;
}
