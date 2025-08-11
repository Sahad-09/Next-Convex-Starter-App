import type { Metadata } from 'next'
import { PricingTable } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Pricing — Jelly Forge',
  description: 'Jelly Forge pricing. Choose a plan to generate AI 3D icons with transparent backgrounds and download ready-to-use app icons.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — Jelly Forge',
    description: 'Plans for designers and teams. Generate 3D jelly icons and download transparent PNGs for apps and web.',
    url: '/pricing',
  },
}

export default function PricingPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
  )
}