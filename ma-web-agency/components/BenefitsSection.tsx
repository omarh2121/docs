'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Users, Smartphone, MousePointerClick, Zap, Bot, Layers, TrendingUp } from 'lucide-react'

const benefits = [
  {
    icon: Globe,
    color: '#60A5FA',
    title: 'Dansk virksomhedssprog',
    desc: 'Vi skriver og kommunikerer på professionelt dansk med lokal forståelse for din branche.',
  },
  {
    icon: Users,
    color: '#A78BFA',
    title: 'Fokus på kunder, ikke kun design',
    desc: 'Et flot design er intet værd, hvis det ikke bringer henvendelser. Vi designer med konvertering som mål.',
  },
  {
    icon: Smartphone,
    color: '#34D399',
    title: 'Moderne mobilvenligt layout',
    desc: 'Alle sider bygges responsivt og testes på mobil, tablet og desktop – ingen kompromiser.',
  },
  {
    icon: MousePointerClick,
    color: '#F472B6',
    title: 'Tydelige CTA\'er og kontaktflow',
    desc: 'Vi placerer de rigtige handlingsknapper de rigtige steder, så kunden altid ved, hvad de skal gøre.',
  },
  {
    icon: Zap,
    color: '#FBBF24',
    title: 'Hurtig og professionel levering',
    desc: 'Ingen lange ventetider. Vi leverer hurtigt og professionelt uden at gå på kompromis med kvaliteten.',
  },
  {
    icon: Bot,
    color: '#06B6D4',
    title: 'AI, chatbot og automatisering',
    desc: 'Mulighed for at tilføje AI-chatbots og automatiseringer, der sparer tid og forbedrer kundeoplevelsen.',
  },
  {
    icon: Layers,
    color: '#FB923C',
    title: 'Design tilpasset din branche',
    desc: 'En frisørsalon og en håndværker har forskellige behov. Vi designer til din specifikke målgruppe.',
  },
  {
    icon: TrendingUp,
    color: '#C4B5FD',
    title: 'Skalerbart setup',
    desc: 'Hjemmesiden bygges så den let kan udvides med nye sider, funktioner og integrationer over tid.',
  },
]

export default function BenefitsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="fordele" className="relative py-24 lg:py-32 bg-dark-950">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute left-0 top-1/3 w-[500px] h-[500px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-violet-300 glass border border-violet-500/20 mb-4">
            Fordele
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Hvorfor vælge{' '}
            <span className="gradient-text">Ma Web Agency?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Vi bygger hjemmesider med ét klart mål: at gøre din virksomhed mere synlig,
            mere troværdig og lettere at kontakte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease: 'easeOut' }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top left, ${b.color}08, transparent 60%)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${b.color}18`,
                    border: `1px solid ${b.color}30`,
                    boxShadow: `0 0 14px ${b.color}20`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{b.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block glass rounded-2xl px-8 py-6 border border-violet-500/20 max-w-2xl">
            <p className="text-lg font-medium text-gray-200 leading-relaxed italic">
              "Vi bygger hjemmesider med ét klart mål: at gøre din virksomhed mere synlig,
              mere troværdig og lettere at kontakte."
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-400 font-medium">Ma Web Agency</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
