'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })
const SplineScene = dynamic(() => import('./SplineScene'), { ssr: false })

const trustBadges = [
  { label: 'Moderne design' },
  { label: 'Mobilvenlig hjemmeside' },
  { label: 'SEO-klar struktur' },
  { label: 'Hurtig levering' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero3D() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-950">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Particles (desktop only, fewer on mobile via CSS) */}
      <div className="hidden sm:block">
        <ParticleField particleCount={600} />
      </div>
      <div className="sm:hidden">
        <ParticleField particleCount={200} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left – copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass border border-violet-500/20 text-violet-300 mb-6">
                <Sparkles className="w-4 h-4" />
                Dansk webbureau – lokal forståelse
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Byg en hjemmeside, der faktisk{' '}
              <span className="gradient-text">skaffer kunder</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-lg"
            >
              Ma Web Agency hjælper lokale virksomheder med moderne hjemmesider,
              stærkere online synlighed og flere henvendelser.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 mb-10 w-full sm:w-auto"
            >
              <motion.button
                onClick={() => scrollTo('#kontakt')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Få et gratis website-tjek
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => scrollTo('#services')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
              >
                Se løsninger
              </motion.button>
              <motion.button
                onClick={() => scrollTo('#kontakt')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
              >
                Kontakt os
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 glass border border-white/8"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {b.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right – 3D scene */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="relative h-[380px] sm:h-[480px] lg:h-[560px] w-full rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,10,30,0.4)',
              border: '1px solid rgba(139,92,246,0.15)',
              boxShadow: '0 0 60px rgba(139,92,246,0.1)',
            }}
          >
            <SplineScene />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none" />
    </section>
  )
}
