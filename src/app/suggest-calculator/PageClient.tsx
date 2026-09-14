'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const CATEGORIES = [
  'financial', 'health', 'math', 'conversion', 'date-time', 'construction',
  'statistics', 'education', 'physics', 'chemistry', 'engineering',
  'everyday', 'food', 'biology', 'ecology', 'sports',
]

const schema = z.object({
  name: z.string().min(1, 'Calculator name is required').max(200),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Please provide at least 10 characters').max(2000),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function SuggestCalculatorPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setError(null)
    try {
      const res = await fetch('/api/suggest-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => 'Unknown error')
        throw new Error(text || `HTTP ${res.status}`)
      }
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit')
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900 dark:bg-emerald-950">
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Thank You!</h1>
          <p className="text-emerald-600 dark:text-emerald-400">
            Your calculator suggestion has been received. Our team will review it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Suggest a Calculator</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Have an idea for a new calculator? Let us know and we will consider adding it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Calculator Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            placeholder="e.g., Mortgage Calculator"
            className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register('category')}
            className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description / Use Case <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            {...register('description')}
            placeholder="Describe what this calculator should do and who would use it..."
            className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Your Email <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-[#1a759f] px-8 text-sm font-semibold text-white hover:bg-[#155d7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </form>
    </div>
  )
}
