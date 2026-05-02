'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Paintbrush, Code2, MessageCircle, Rocket } from 'lucide-react'

const steps = [
  {
    icon: Search,
    number: '01',
    color: '#60A5FA',
    title: 'Analyse',
    desc: 'Vi gennemgår virksomheden, målgruppen og hvad hjemmesiden skal opnå – så designet ramme rigtigt fra start.',
  },
  {
    icon: Paintbrush,
    number: '02',
    color: '#A78BFA',
    title: 'Design',
    desc: 'Vi skaber et moderne visuelt udtryk, der passer til branchen og kommunikerer troværdighed og professionalisme.',
  },
  {
    icon: Code2,
    number: '03',
    color: '#34D399',
    title: 'Bygning',
    desc: 'Vi bygger hjemmesiden responsivt, hurtigt og professionelt med fokus på performance og brugervenlighed.',
  },
  {
    icon: MessageCircle,
    number: '04',
    color: '#FBBF24',
    title: 'Feedback',
    desc: 'Du får mulighed for at gennemgå siden og komme med rettelser, inden den bliver lanceret.',
  },
  {
    icon: Rocket,
    number: '05',
    color: '#F472B6',
    title: 'Lancering',
    desc: 'Siden gøres klar til brug – klar til at kunderne kan finde og kontakte din virksomhed online.',
  },
]

export default function ProcessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="proces" className="relative py-24 lg:py-32 bg-dark-950">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute left-1/4 bottom-0 w-[500px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-green-300 glass border border-green-500/20 mb-4">
            Vores proces
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Fra idé til færdig hjemmeside{' '}
            <span className="gradient-text">uden unødvendigt bøvl</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            En enkel og gennemsigtig proces, der holder dig informeret hele vejen fra start til lancering.
          </p>
        </motion.div>

        {/* Workflow indicator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center gap-3 mb-14 flex-wrap"
        >
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center gap-3">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}35` }}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="group relative glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top, ${step.color}08, transparent 70%)` }}
                />

                {/* Step number */}
                <span className="text-xs font-bold text-gray-600 mb-3 tracking-widest">{step.number}</span>

                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `${step.color}18`,
                    border: `1px solid ${step.color}35`,
                    boxShadow: `0 0 20px ${step.color}25`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
