export interface Author {
  id: string;
  name: string;
  credentials: string;     // e.g., "MD, Internal Medicine"
  bio: string;
  avatar?: string;
  specialty: string[];     // hub slugs they review
}

export const AUTHORS: Record<string, Author> = {
  'dr-sarah-chen': {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    credentials: 'MD, MPH',
    bio: 'Board-certified physician with 12 years in preventive medicine. Reviews health, nutrition, and life-science calculators.',
    specialty: ['health-calculators', 'biology-calculators', 'food-calculators'],
  },
  'james-mitchell': {
    id: 'james-mitchell',
    name: 'James Mitchell, CFA',
    credentials: 'Chartered Financial Analyst',
    bio: 'Former investment banker with 15 years advising on retirement and mortgage planning. Reviews finance and math calculators.',
    specialty: ['financial-calculators', 'math-calculators'],
  },
  'dr-elena-petrova': {
    id: 'dr-elena-petrova',
    name: 'Dr. Elena Petrova',
    credentials: 'PhD, Physics',
    bio: 'Professor of physics with 18 years researching mechanics and thermodynamics. Reviews physics, chemistry, and engineering calculators.',
    specialty: ['physics-calculators', 'chemistry-calculators', 'engineering-calculators'],
  },
  'marcus-johnson': {
    id: 'marcus-johnson',
    name: 'Marcus Johnson',
    credentials: 'MSc, Mathematics Educator',
    bio: 'High-school math teacher and curriculum developer with 14 years of classroom experience. Reviews math, statistics, and education calculators.',
    specialty: ['math-calculators', 'statistics-calculators', 'education-calculators', 'conversion-calculators'],
  },
  'priya-sharma': {
    id: 'priya-sharma',
    name: 'Priya Sharma, PE',
    credentials: 'Licensed Civil Engineer',
    bio: 'Civil engineer specializing in construction estimation and structural design. Reviews construction, everyday, and sports calculators.',
    specialty: ['construction-calculators', 'everyday-calculators', 'sports-calculators', 'ecology-calculators', 'date-time-calculators'],
  },
};

export function getAuthorForHub(hub: string): Author {
  const found = Object.values(AUTHORS).find(a => a.specialty.includes(hub));
  return found || AUTHORS['dr-sarah-chen'];
}

export const AUTHOR_LIST: Author[] = Object.values(AUTHORS);
