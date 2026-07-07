import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample presets
  const presets = [
    { name: '30-year Fixed', data: { loanAmount: 300000, interestRate: 6.5, term: 30 }, calculatorType: 'mortgage-calculator' },
    { name: '15-year Fixed', data: { loanAmount: 300000, interestRate: 5.5, term: 15 }, calculatorType: 'mortgage-calculator' },
    { name: '5/1 ARM', data: { loanAmount: 300000, interestRate: 6.0, term: 30, armInitialPeriod: 5 }, calculatorType: 'mortgage-calculator' },
  ]

  for (const preset of presets) {
    await prisma.preset.upsert({
      where: { id: preset.name.toLowerCase().replace(/\s+/g, '-') },
      update: preset,
      create: { id: preset.name.toLowerCase().replace(/\s+/g, '-'), ...preset },
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
