'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Target, BarChart3, Palette, MessageSquare, Bot } from 'lucide-react'

const services = [
  {
    icon: Monitor,
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.2)',
    title: 'Hjemmesider',
    subtitle: 'Professionel digital tilstedeværelse',
    desc: 'Moderne, hurtige og mobilvenlige hjemmesider til lokale virksomheder. Bygget til at skabe tillid og konvertere besøgende til kunder.',
    tags: ['Next.js', 'Responsivt', 'Hurtigt'],
  },
  {
    icon: Target,
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.2)',
    title: 'Landing pages',
    subtitle: 'Kampagner der konverterer',
    desc: 'Salgssider bygget til kampagner, annoncer og konkrete tilbud. Designet med ét klart mål: at få den besøgende til at handle.',
    tags: ['Konvertering', 'Google Ads', 'Meta Ads'],
  },
  {
    icon: BarChart3,
    color: '#34D399',
    glow: 'rgba(52,211,153,0.2)',
    title: 'SEO-struktur',
    subtitle: 'Bliv fundet på Google',
    desc: 'Grundlæggende SEO, så kunder lettere kan finde din virksomhed online. Teknisk struktur, metadata og lokal søgeoptimering.',
    tags: ['Google', 'Lokal SEO', 'Synlighed'],
  },
  {
    icon: Palette,
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.2)',
    title: 'Branding',
    subtitle: 'Se professionel ud',
    desc: 'Visuel stil, farver, tekst og struktur, der får virksomheden til at virke mere professionel og genkendeligt over for kunderne.',
    tags: ['Logo', 'Farver', 'Tone of voice'],
  },
  {
    icon: MessageSquare,
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.2)',
    title: 'Booking og kontaktflow',
    subtitle: 'Gør det nemt at kontakte dig',
    desc: 'Kontaktformularer, bookinglinks og klare CTA\'er, så kunder nemt kan tage næste skridt og du aldrig går glip af en henvendelse.',
    tags: ['Formular', 'Booking', 'CTA'],
  },
  {
    icon: Bot,
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.2)',
    title: 'AI og automatisering',
    subtitle: 'Spar tid og svar hurtigere',
    desc: 'Simple AI-løsninger, chatbots og workflows, der kan spare tid i kundedialogen og sikre hurtige svar – selv uden for åbningstid.',
    tags: ['Chatbot', 'AI', 'Workflow'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function ServicesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-dark-900">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div
        className="absolute right-0 top-1/4 w-[500px] h-[500px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-blue-300 glass border border-blue-500/20 mb-4">
            Ydelser
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Digitale løsninger der får din virksomhed{' '}
            <span className="gradient-text">til at se professionel ud</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Fra hjemmeside og SEO til branding og AI-automatisering – vi samler det, din
            virksomhed har brug for digitalt.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((s) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group relative glass rounded-2xl p-7 border border-white/8 transition-all duration-300 hover:border-white/15 flex flex-col"
              >
                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(circle at top left, ${s.glow}, transparent 60%)` }}
                />

                {/* Icon */}
                <div
                  className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 self-start"
                  style={{
                    width: 52,
                    height: 52,
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}35`,
                    boxShadow: `0 0 16px ${s.color}20`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: s.color }} />
                </div>

                <span className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: s.color }}>
                  {s.subtitle}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ background: `${s.color}12`, color: `${s.color}`, border: `1px solid ${s.color}25` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
