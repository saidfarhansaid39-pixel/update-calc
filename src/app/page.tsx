import { Link } from '@/lib/navigation';
import dynamic from 'next/dynamic';
import { TrendingUp, Star, Calculator, ArrowRight, ChevronRight, Sparkles, BarChart3, Heart, RefreshCw, Clock, DollarSign, Brain, UtensilsCrossed, Microscope, Leaf, Trophy } from 'lucide-react';
import { MediaMentions } from '@/components/MediaMentions';
import { getTranslations } from 'next-intl/server';
import { calculatorRegistry } from '@calcuniverse/calculator-registry'

const SearchBar = dynamic(() => import('@/components/SearchBar').then(mod => ({ default: mod.SearchBar })), {
  loading: () => <div className="h-[52px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />,
});

export const revalidate = 3600

export default async function Home() {
  const tHome = await getTranslations('homepage')
  const tHubs = await getTranslations('hubs')
  function getCalculatorCount(hubSlug: string): number {
    return calculatorRegistry.filter(c => c.hubSlug === hubSlug).length
  }

  const hubs = [
    { name: tHubs('name_financial'), href: '/financial-calculators/', desc: tHubs('desc_financial'), icon: DollarSign, count: getCalculatorCount('financial-calculators') },
    { name: tHubs('name_health'), href: '/health-calculators/', desc: tHubs('desc_health'), icon: Heart, count: getCalculatorCount('health-calculators') },
    { name: tHubs('name_math'), href: '/math-calculators/', desc: tHubs('desc_math'), icon: BarChart3, count: getCalculatorCount('math-calculators') },
    { name: tHubs('name_conversion'), href: '/conversion-calculators/', desc: tHubs('desc_conversion'), icon: RefreshCw, count: getCalculatorCount('conversion-calculators') },
    { name: tHubs('name_date-time'), href: '/date-time-calculators/', desc: tHubs('desc_date-time'), icon: Clock, count: getCalculatorCount('date-time-calculators') },
    { name: tHubs('name_construction'), href: '/construction-calculators/', desc: tHubs('desc_construction'), icon: Calculator, count: getCalculatorCount('construction-calculators') },
    { name: tHubs('name_statistics'), href: '/statistics-calculators/', desc: tHubs('desc_statistics'), icon: BarChart3, count: getCalculatorCount('statistics-calculators') },
    { name: tHubs('name_education'), href: '/education-calculators/', desc: tHubs('desc_education'), icon: Star, count: getCalculatorCount('education-calculators') },
    { name: tHubs('name_physics'), href: '/physics-calculators/', desc: tHubs('desc_physics'), icon: TrendingUp, count: getCalculatorCount('physics-calculators') },
    { name: tHubs('name_chemistry'), href: '/chemistry-calculators/', desc: tHubs('desc_chemistry'), icon: Brain, count: getCalculatorCount('chemistry-calculators') },
    { name: tHubs('name_engineering'), href: '/engineering-calculators/', desc: tHubs('desc_engineering'), icon: TrendingUp, count: getCalculatorCount('engineering-calculators') },
    { name: tHubs('name_everyday'), href: '/everyday-calculators/', desc: tHubs('desc_everyday'), icon: RefreshCw, count: getCalculatorCount('everyday-calculators') },
    { name: tHubs('name_food'), href: '/food-calculators/', desc: tHubs('desc_food'), icon: UtensilsCrossed, count: getCalculatorCount('food-calculators') },
    { name: tHubs('name_biology'), href: '/biology-calculators/', desc: tHubs('desc_biology'), icon: Microscope, count: getCalculatorCount('biology-calculators') },
    { name: tHubs('name_ecology'), href: '/ecology-calculators/', desc: tHubs('desc_ecology'), icon: Leaf, count: getCalculatorCount('ecology-calculators') },
    { name: tHubs('name_sports'), href: '/sports-calculators/', desc: tHubs('desc_sports'), icon: Trophy, count: getCalculatorCount('sports-calculators') },
  ];

  const popular = [
    { name: 'Mortgage Calculator', href: '/financial-calculators/mortgage-calculator', desc: 'Estimate monthly payments', tag: tHubs('name_financial') },
    { name: 'BMI Calculator', href: '/health-calculators/bmi-calculator', desc: 'Check your body mass index', tag: tHubs('name_health') },
    { name: 'Tip Calculator', href: '/math-calculators/tip-calculator', desc: 'Calculate tips easily', tag: tHubs('name_math') },
    { name: 'Compound Interest', href: '/financial-calculators/compound-interest-calculator', desc: 'See your money grow', tag: tHubs('name_financial') },
    { name: 'Loan Calculator', href: '/financial-calculators/loan-calculator', desc: 'Calculate loan payments', tag: tHubs('name_financial') },
    { name: 'Salary Calculator', href: '/financial-calculators/salary-calculator', desc: 'Convert salary amounts', tag: tHubs('name_financial') },
    { name: 'Retirement Calculator', href: '/financial-calculators/retirement-calculator', desc: 'Plan your future', tag: tHubs('name_financial') },
    { name: 'Currency Calculator', href: '/financial-calculators/currency-calculator', desc: 'Convert any currency', tag: tHubs('name_financial') },
  ];

  const trending = [
    { name: 'Auto Loan', href: '/financial-calculators/auto-loan-calculator', desc: 'Car payment estimator', icon: DollarSign },
    { name: '401K Calculator', href: '/financial-calculators/401k-calculator', desc: 'Retirement savings planner', icon: Brain },
    { name: 'House Affordability', href: '/financial-calculators/house-affordability-calculator', desc: 'How much house you can afford', icon: Calculator },
    { name: 'Student Loan', href: '/financial-calculators/student-loan-calculator', desc: 'Repayment strategies', icon: Heart },
  ];

  const features = [
    { title: tHome('featureFastTitle'), desc: tHome('featureFastDesc') },
    { title: tHome('featureAITitle'), desc: tHome('featureAIDesc') },
    { title: tHome('featurePrecisionTitle'), desc: tHome('featurePrecisionDesc') },
    { title: tHome('featureDesignTitle'), desc: tHome('featureDesignDesc') },
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
              {tHome('heroBadge')}
            </span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {tHome.rich('heroTitle', {
                highlight: (chunks) => <span className="text-gradient">{chunks}</span>,
              })}
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              {tHome('heroSubtitle')}
            </p>

            <div className="relative max-w-xl mx-auto mb-8">
              <SearchBar />
            </div>

            <div className="flex justify-center gap-8 sm:gap-12">
              {[
                { value: '200+', label: tHome('statCalculators') },
                { value: '16', label: tHome('statCategories') },
                { value: tHome('statFree'), label: tHome('statFree') },
                { value: '99.9%', label: tHome('statUptime') },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hubs.map((hub, i) => {
            const Icon = hub.icon;
            return (
              <div key={i}>
                <Link
                  href={hub.href}
                  className="group card-premium dark:bg-gray-800 dark:border-gray-700 p-4 flex items-start gap-3 hover:translate-y-[-2px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] transition-colors">{hub.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hub.desc}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-medium text-[#1a3a8a] dark:text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 px-2 py-0.5 rounded-full">{hub.count} {tHome('statCalculators')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                </Link>
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
              {tHome('popularTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tHome('popularSubtitle')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.map((calc, i) => (
            <div key={i}>
              <Link
                href={calc.href}
                className="group card-premium dark:bg-gray-800 dark:border-gray-700 p-4 hover:translate-y-[-2px] block"
              >
                <span className="inline-block text-[10px] font-medium text-[#1a3a8a] dark:text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 px-2 py-0.5 rounded-full mb-2">{calc.tag}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1a3a8a] dark:group-hover:text-[#06b6d4] transition-colors">{calc.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{calc.desc}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 dark:from-[#0a1d4f]/20 dark:to-[#0a1d4f]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#1a3a8a]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tHome('trendingTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {trending.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div key={i}>
                  <Link
                    href={tool.href}
                    className="flex items-center gap-3 card-premium dark:bg-gray-800 dark:border-gray-700 p-4 hover:translate-y-[-2px]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white">{tool.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tool.desc}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tHome('featuresTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{tHome('featuresSubtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="card-premium dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#1a3a8a] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{tHome('ctaTitle')}</h2>
            <p className="text-[#c7d2fe] mb-6 max-w-md mx-auto">{tHome('ctaSubtitle')}</p>
            <Link
              href="/financial-calculators/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1a3a8a] font-semibold hover:bg-[#e0e7ff] transition-all duration-200 shadow-lg"
            >
              {tHome('ctaButton')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
