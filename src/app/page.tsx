import { TrendingUp, Star, Calculator, ArrowRight, ChevronRight, Sparkles, BarChart3, Heart, RefreshCw, Clock, DollarSign, Brain, UtensilsCrossed, Microscope, Leaf, Trophy } from 'lucide-react';
import { MediaMentions } from '@/components/MediaMentions';
import { SearchBarWrapper } from '@/components/SearchBarWrapper';
import { HubNav } from '@/components/hub/HubNav';
import { HubIcon } from '@/components/hub/HubIcon';

export const dynamic = 'force-static'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export async function generateMetadata() {
  const { getLocale, getTranslations } = await import('next-intl/server')
  const locale = await getLocale()
  const t = await getTranslations('homepage')
  const title = locale === 'en' ? 'JDCALC - Precision Calculators & Unit Converters' : `JDCALC - ${t('heroBadge')}`
  const description = t('heroSubtitle')
  const routing = (await import('@/i18n/routing')).routing
  const languages: Record<string, string> = { 'x-default': siteUrl }
  for (const l of routing.locales) {
    languages[l] = l === 'en' ? siteUrl : `${siteUrl}/${l}`
  }
  return {
    title,
    description,
    alternates: { canonical: siteUrl, languages },
    openGraph: { title, description, url: siteUrl, siteName: 'JDCALC', type: 'website', locale: locale === 'en' ? 'en_US' : locale === 'zh-CN' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`, images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${siteUrl}/og-image.png`] },
  }
}

export default async function Home() {
  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')
  function getCalculatorCount(hubSlug: string): number {
    return calculatorRegistry.filter(c => c.hubSlug === hubSlug).length
  }

  const hubs = [
    { name: 'Financial Calculators', href: '/financial-calculators/', desc: 'Calculate loans, mortgages, investments, and more', icon: DollarSign, count: getCalculatorCount('financial-calculators') },
    { name: 'Health & Fitness', href: '/health-calculators/', desc: 'BMI, BMR, body fat, heart rate, and health tools', icon: Heart, count: getCalculatorCount('health-calculators') },
    { name: 'Math Calculators', href: '/math-calculators/', desc: 'Algebra, geometry, trigonometry, statistics tools', icon: BarChart3, count: getCalculatorCount('math-calculators') },
    { name: 'Conversion Tools', href: '/conversion-calculators/', desc: 'Length, mass, volume, temperature, currency converters', icon: RefreshCw, count: getCalculatorCount('conversion-calculators') },
    { name: 'Date & Time', href: '/date-time-calculators/', desc: 'Age, date difference, time duration calculators', icon: Clock, count: getCalculatorCount('date-time-calculators') },
    { name: 'Construction', href: '/construction-calculators/', desc: 'Concrete, roofing, flooring, paint estimators', icon: Calculator, count: getCalculatorCount('construction-calculators') },
    { name: 'Statistics', href: '/statistics-calculators/', desc: 'Regression, ANOVA, distributions, hypothesis tests', icon: BarChart3, count: getCalculatorCount('statistics-calculators') },
    { name: 'Education', href: '/education-calculators/', desc: 'Grade, GPA, learning tools for students', icon: Star, count: getCalculatorCount('education-calculators') },
    { name: 'Physics', href: '/physics-calculators/', desc: 'Motion, force, energy, waves, mechanics calculators', icon: TrendingUp, count: getCalculatorCount('physics-calculators') },
    { name: 'Chemistry', href: '/chemistry-calculators/', desc: 'Elements, reactions, molar mass, pH calculators', icon: Brain, count: getCalculatorCount('chemistry-calculators') },
    { name: 'Engineering', href: '/engineering-calculators/', desc: 'Electrical, mechanical, civil engineering tools', icon: TrendingUp, count: getCalculatorCount('engineering-calculators') },
    { name: 'Everyday Life', href: '/everyday-calculators/', desc: 'Tip, discount, budget, salary, utility calculators', icon: RefreshCw, count: getCalculatorCount('everyday-calculators') },
    { name: 'Food & Cooking', href: '/food-calculators/', desc: 'Recipe converter, nutrition, serving size tools', icon: UtensilsCrossed, count: getCalculatorCount('food-calculators') },
    { name: 'Biology', href: '/biology-calculators/', desc: 'Genetics, ecology, microbiology calculators', icon: Microscope, count: getCalculatorCount('biology-calculators') },
    { name: 'Ecology', href: '/ecology-calculators/', desc: 'Carbon footprint, water, energy sustainability tools', icon: Leaf, count: getCalculatorCount('ecology-calculators') },
    { name: 'Sports & Fitness', href: '/sports-calculators/', desc: 'Pace, calories, heart rate, training calculators', icon: Trophy, count: getCalculatorCount('sports-calculators') },
  ];

  const regBySlug = new Map(calculatorRegistry.map((c: any) => [c.slug, c]))
  const POPULAR_SLUGS = [
    'mortgage-calculator',
    'bmi-calculator',
    'loan-calculator',
    'compound-interest-calculator',
    'retirement-calculator',
    'salary-calculator',
    'calorie-calculator',
    'tip-calculator',
    'currency-calculator',
    'gpa-calculator',
    'body-fat-calculator',
    'age-difference-calculator',
  ]
  const popular = POPULAR_SLUGS.map((slug) => regBySlug.get(slug))
    .filter(Boolean)
    .map((c: any) => ({ slug: c.slug, hubSlug: c.hubSlug, title: c.title, desc: c.description || '' }))

  const trending = [
    { name: 'Auto Loan', href: '/financial-calculators/auto-loan-calculator', desc: 'Car payment estimator', icon: DollarSign },
    { name: '401K Calculator', href: '/financial-calculators/401k-calculator', desc: 'Retirement savings planner', icon: Brain },
    { name: 'House Affordability', href: '/financial-calculators/house-affordability-calculator', desc: 'How much house you can afford', icon: Calculator },
    { name: 'Student Loan', href: '/financial-calculators/student-loan-calculator', desc: 'Repayment strategies', icon: Heart },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#e0e7ff]/10 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-24">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#c7d2fe]/30 text-[#1a3a8a] dark:bg-[#1a3a8a]/20 dark:text-[#06b6d4] border border-[#c7d2fe]/30 dark:border-[#1a3a8a]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Free Online Calculators
            </span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Precision <span className="text-gradient">Calculators</span> for Everyone
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Free, fast, and beautifully designed calculators for finance, health, math, science, and everyday life.
            </p>

            <div className="relative max-w-xl mx-auto mb-8">
              <SearchBarWrapper />
            </div>

            <div className="flex justify-center gap-8 sm:gap-12">
              {[
                { value: '200+', label: 'Calculators' },
                { value: '16', label: 'Categories' },
                { value: 'Free', label: 'Always Free' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category quick-nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-10">
        <HubNav />
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hubs.map((hub, i) => {
            const Icon = hub.icon;
            return (
              <div key={i}>
                <a
                  href={hub.href}
                  className="group card-premium dark:bg-gray-800 dark:border-gray-700 p-4 flex items-start gap-3 hover:translate-y-[-2px] block"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] transition-colors">{hub.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{hub.desc}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-medium text-[#1a3a8a] dark:text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 px-2 py-0.5 rounded-full">{hub.count} Calculators</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-[#1a3a8a]" />
              Popular Calculators
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Most used calculators by our community</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.map((calc, i) => (
            <div key={i}>
              <a
                href={`/${calc.hubSlug}/${calc.slug}`}
                className="group card-premium dark:bg-gray-800 dark:border-gray-700 p-4 hover:translate-y-[-2px] block"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center mb-2">
                  <HubIcon slug={calc.hubSlug} className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">{calc.desc}</p>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#1a3a8a]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {trending.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div key={i}>
                  <a
                    href={tool.href}
                    className="flex items-center gap-3 card-premium dark:bg-gray-800 dark:border-gray-700 p-4 hover:translate-y-[-2px]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white">{tool.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{tool.desc}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why JDCALC?</h2>
          <p className="text-gray-500 dark:text-gray-300 mt-1">Built for speed, accuracy, and ease of use</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Lightning Fast', desc: 'Instant calculations with no page reloads' },
            { title: 'AI-Powered', desc: 'Smart suggestions and explanations' },
            { title: 'Pinpoint Accuracy', desc: 'Verified formulas for reliable results' },
            { title: 'Beautiful Design', desc: 'Clean, modern interface with dark mode' },
          ].map((f, i) => (
            <div key={i} className="card-premium dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <MediaMentions />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-[#1a3a8a] to-[#0a1d4f] p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-light opacity-10" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start Calculating Now</h2>
            <p className="text-[#c7d2fe] mb-6 max-w-md mx-auto">Explore thousands of free calculators across 16 categories</p>
            <a
              href="/financial-calculators/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1a3a8a] font-semibold hover:bg-[#e0e7ff] transition-all duration-200 shadow-lg"
            >
              Browse Calculators
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
