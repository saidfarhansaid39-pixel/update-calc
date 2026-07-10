export interface HubTheme {
  slug: string;
  name: string;
  accent: string;        // hex primary accent
  accentRgb: string;     // "6 182 212" for tailwind rgb vars
  gradient: string;       // tailwind gradient classes
  icon: string;           // lucide icon name
  emoji: string;
}

export const HUB_THEMES: Record<string, HubTheme> = {
  health:      { slug: 'health', name: 'Health', accent: '#10b981', accentRgb: '16 185 129', gradient: 'from-emerald-500 to-teal-600', icon: 'HeartPulse', emoji: '🩺' },
  finance:     { slug: 'finance', name: 'Finance', accent: '#22c55e', accentRgb: '34 197 94', gradient: 'from-green-500 to-emerald-600', icon: 'Landmark', emoji: '💰' },
  math:        { slug: 'math', name: 'Math', accent: '#3b82f6', accentRgb: '59 130 246', gradient: 'from-blue-500 to-indigo-600', icon: 'Calculator', emoji: '🔢' },
  conversion:  { slug: 'conversion', name: 'Conversion', accent: '#06b6d4', accentRgb: '6 182 212', gradient: 'from-cyan-500 to-sky-600', icon: 'ArrowLeftRight', emoji: '🔄' },
  'date-time': { slug: 'date-time', name: 'Date & Time', accent: '#8b5cf6', accentRgb: '139 92 246', gradient: 'from-violet-500 to-purple-600', icon: 'Calendar', emoji: '📅' },
  construction:{ slug: 'construction', name: 'Construction', accent: '#f59e0b', accentRgb: '245 158 11', gradient: 'from-amber-500 to-orange-600', icon: 'HardHat', emoji: '🏗️' },
  statistics:  { slug: 'statistics', name: 'Statistics', accent: '#ec4899', accentRgb: '236 72 153', gradient: 'from-pink-500 to-rose-600', icon: 'BarChart3', emoji: '📊' },
  education:   { slug: 'education', name: 'Education', accent: '#14b8a6', accentRgb: '20 184 166', gradient: 'from-teal-500 to-cyan-600', icon: 'GraduationCap', emoji: '🎓' },
  physics:     { slug: 'physics', name: 'Physics', accent: '#6366f1', accentRgb: '99 102 241', gradient: 'from-indigo-500 to-blue-600', icon: 'Atom', emoji: '⚛️' },
  chemistry:   { slug: 'chemistry', name: 'Chemistry', accent: '#84cc16', accentRgb: '132 204 22', gradient: 'from-lime-500 to-green-600', icon: 'FlaskConical', emoji: '🧪' },
  engineering: { slug: 'engineering', name: 'Engineering', accent: '#f97316', accentRgb: '249 115 22', gradient: 'from-orange-500 to-red-600', icon: 'Cog', emoji: '⚙️' },
  everyday:    { slug: 'everyday', name: 'Everyday', accent: '#a855f7', accentRgb: '168 85 247', gradient: 'from-purple-500 to-fuchsia-600', icon: 'Lightbulb', emoji: '💡' },
  food:        { slug: 'food', name: 'Food', accent: '#ef4444', accentRgb: '239 68 68', gradient: 'from-red-500 to-rose-600', icon: 'Utensils', emoji: '🍎' },
  biology:     { slug: 'biology', name: 'Biology', accent: '#059669', accentRgb: '5 150 105', gradient: 'from-emerald-600 to-green-700', icon: 'Dna', emoji: '🧬' },
  ecology:     { slug: 'ecology', name: 'Ecology', accent: '#16a34a', accentRgb: '22 163 74', gradient: 'from-green-600 to-lime-700', icon: 'Leaf', emoji: '🌿' },
  sports:      { slug: 'sports', name: 'Sports', accent: '#0ea5e9', accentRgb: '14 165 233', gradient: 'from-sky-500 to-blue-600', icon: 'Trophy', emoji: '🏆' },
};

// Maps registry category values / full hub slugs to the canonical theme key.
const SLUG_ALIASES: Record<string, string> = {
  financial: 'finance',
  'financial-calculators': 'finance',
};

export function normalizeHubSlug(slug: string): string {
  if (!slug) return 'math';
  let key = slug.trim().toLowerCase();
  if (SLUG_ALIASES[key]) return SLUG_ALIASES[key];
  if (key.endsWith('-calculators')) key = key.slice(0, -'-calculators'.length);
  if (SLUG_ALIASES[key]) return SLUG_ALIASES[key];
  return key;
}

export function getHubTheme(slug: string): HubTheme {
  return HUB_THEMES[normalizeHubSlug(slug)] || HUB_THEMES.math;
}
