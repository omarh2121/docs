'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scissors, UtensilsCrossed, Wrench, HeartPulse, Car, LayoutTemplate, ExternalLink } from 'lucide-react'

const portfolioItems = [
  {
    icon: Scissors,
    color: '#F472B6',
    bg: 'rgba(244,114,182,0.08)',
    category: 'Frisør',
    title: 'Frisør website',
    desc: 'Moderne side med priser, services, billeder og direkte bookingmulighed. Designet til at skabe tillid og konvertere.',
    tags: ['Booking', 'Galleri', 'Prisliste', 'SEO'],
  },
  {
    icon: UtensilsCrossed,
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.08)',
    category: 'Restaurant',
    title: 'Restaurant website',
    desc: 'Menu, åbningstider, Google Maps, kontakt og online bestilling. Alt hvad en restaurant har brug for digitalt.',
    tags: ['Menu', 'Kort', 'Bestilling', 'Åbningstider'],
  },
  {
    icon: Wrench,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.08)',
    category: 'Håndværker',
    title: 'Håndværker website',
    desc: 'Tydelige ydelser, referencer og kontaktformular – bygget til lokal synlighed og direkte henvendelser.',
    tags: ['Ydelser', 'Referencer', 'Lokal SEO', 'Kontakt'],
  },
  {
    icon: HeartPulse,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.08)',
    category: 'Klinik',
    title: 'Klinik website',
    desc: 'Professionelt design, behandlinger, priser og et bookingflow der giver klinikken et højt troværdighedsniveau.',
    tags: ['Behandlinger', 'Booking', 'Priser', 'Professionelt'],
  },
  {
    icon: Car,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    category: 'Transport',
    title: 'Taxi / transport website',
    desc: 'Services, app-download, erhvervsaftaler og kontaktflow – optimeret til hurtige henvendelser og bookinger.',
    tags: ['Services', 'App', 'Erhverv', 'Kontakt'],
  },
  {
    icon: LayoutTemplate,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    category: 'SaaS',
    title: 'SaaS landing page',
    desc: 'Premium landing page til digitalt produkt med klare CTA\'er, prissektion og demo-mulighed.',
    tags: ['Premium', 'CTA', 'Pricing', 'Demo'],
  },
]

export default function PortfolioSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 bg-dark-900">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div
        className="absolute right-0 bottom-0 w-[500px] h-[400px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-cyan-300 glass border border-cyan-500/20 mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Eksempler på løsninger{' '}
            <span className="gradient-text-cyan">vi kan bygge</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-sm text-gray-500 mb-14 max-w-lg mx-auto"
        >
          Disse eksempler er designretninger. Rigtige cases tilføjes, når bureauet har færdige kundeprojekter.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/18 transition-all duration-300 cursor-default"
                style={{ background: item.bg, backdropFilter: 'blur(12px)' }}
              >
                {/* Top bar */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${item.color}20`,
                        border: `1px solid ${item.color}35`,
                        boxShadow: `0 0 16px ${item.color}20`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>

                {/* Simulated browser preview */}
                <div className="mx-6 mb-5 rounded-xl overflow-hidden border border-white/8">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="w-2 h-2 rounded-full bg-red-500/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-green-500/60" />
                    <div className="ml-2 flex-1 h-3.5 rounded bg-white/5 flex items-center px-2">
                      <span className="text-[8px] text-gray-600">eksempel-site.dk</span>
                    </div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="h-14 rounded-lg mb-2" style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }} />
                    <div className="space-y-1.5">
                      <div className="h-2 rounded bg-white/5 w-4/5" />
                      <div className="h-2 rounded bg-white/5 w-3/5" />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="px-6 pb-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'rgba(3,7,18,0.4)', backdropFilter: 'blur(2px)' }}
                  />
                  <span
                    className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: `${item.color}30`, border: `1px solid ${item.color}50` }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Se eksempel
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
