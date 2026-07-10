'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const mentions = [
  { name: 'Forbes', href: '#', style: 'font-bold tracking-tight' },
  { name: 'TechCrunch', href: '#', style: 'font-semibold italic' },
  { name: 'Product Hunt', href: '#', style: 'font-bold' },
  { name: 'CNN', href: '#', style: 'font-black tracking-wider' },
  { name: 'Lifehacker', href: '#', style: 'font-medium' },
  { name: 'The Verge', href: '#', style: 'font-semibold' },
];

export function MediaMentions() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center"
      >
        <motion.p variants={fadeInUp} className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-400 mb-6">
          As Seen On
        </motion.p>
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {mentions.map((m) => (
            <a
              key={m.name}
              href={m.href}
              aria-label={`As seen on ${m.name}`}
              className="text-lg sm:text-xl text-gray-300 dark:text-gray-600 hover:text-[#1a3a8a] dark:hover:text-[#06b6d4] transition-colors duration-300"
            >
              <span className={m.style}>{m.name}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
