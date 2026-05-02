'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { AlertTriangle, Search, Smartphone, Eye, PhoneOff, LayoutDashboard } from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    color: '#F87171',
    title: 'Hjemmesiden ser gammel eller uprofessionel ud',
    desc: 'Første indtryk skabes på sekunder. En forældet side sender kunderne videre til konkurrenten.',
  },
  {
    icon: Search,
    color: '#FBBF24',
    title: 'Kunden finder konkurrenten først på Google',
    desc: 'Uden en SEO-klar struktur er din virksomhed usynlig for dem, der søger lokalt.',
  },
  {
    icon: Smartphone,
    color: '#FB923C',
    title: 'Siden virker dårligt på mobilen',
    desc: 'Over 70 % af besøgende bruger mobil. En side, der ikke virker mobil, mister disse kunder.',
  },
  {
    icon: Eye,
    color: '#60A5FA',
    title: 'Det er uklart, hvad virksomheden tilbyder',
    desc: 'Forvirrede besøgende forlader siden. Tydelig kommunikation af ydelser er afgørende.',
  },
  {
    icon: PhoneOff,
    color: '#A78BFA',
    title: 'Der mangler tydelige kontaktknapper',
    desc: 'Uden klare CTA\'er ved besøgende ikke, hvad de skal gøre – og de gør ingenting.',
  },
  {
    icon: LayoutDashboard,
    color: '#34D399',
    title: 'Ingen struktur til leads, booking eller henvendelser',
    desc: 'En hjemmeside uden kontaktflow er som en butik uden kasse – der er ingen vej til et salg.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="problem" className="relative py-24 lg:py-32 bg-dark-950">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(248,113,113,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-red-300 glass border border-red-500/20 mb-4">
            Problemet
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Mange virksomheder taber kunder,{' '}
            <span className="text-red-400">før de overhovedet</span>
            <br className="hidden sm:block" /> bliver kontaktet
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            En hjemmeside skal ikke bare være pæn. Den skal skabe tillid, forklare dit tilbud og
            gøre det nemt for kunden at kontakte dig.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((p) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative glass rounded-2xl p-6 border border-white/8 transition-all duration-300 hover:border-white/15 cursor-default"
                style={{
                  '--glow': p.color,
                } as React.CSSProperties}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top left, ${p.color}08, transparent 60%)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
