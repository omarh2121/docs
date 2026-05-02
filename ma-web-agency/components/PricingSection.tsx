'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Building2, Crown, Sparkles } from 'lucide-react'

const plans = [
  {
    icon: Zap,
    name: 'Start',
    subtitle: 'Til den lille virksomhed, der skal hurtigt online.',
    price: 'Fra 4.000 kr.',
    color: '#60A5FA',
    popular: false,
    cta: 'Vælg Start',
    features: [
      '1 professionel landing page',
      'Mobilvenligt design',
      'Kontaktsektion',
      'Grundlæggende SEO-struktur',
      'Klar CTA',
    ],
  },
  {
    icon: Building2,
    name: 'Business',
    subtitle: 'Til virksomheder der vil have en komplet professionel hjemmeside.',
    price: 'Fra 8.000 kr.',
    color: '#A78BFA',
    popular: true,
    cta: 'Vælg Business',
    features: [
      'Op til 5 sider',
      'Forside, services, om os, kontakt',
      'Mobilvenligt design',
      'SEO-struktur',
      'Kontaktformular',
      'Google Maps',
      'CTA-flow',
    ],
  },
  {
    icon: Crown,
    name: 'Premium',
    subtitle: 'Til virksomheder der vil have et stærkere digitalt setup.',
    price: 'Fra 15.000 kr.',
    color: '#F472B6',
    popular: false,
    cta: 'Vælg Premium',
    features: [
      'Premium design',
      'Flere undersider',
      'Booking eller leadflow',
      'AI-chatbot mulighed',
      'Automatisering',
      'Strategisk tekststruktur',
      'Ekstra animationer',
    ],
  },
  {
    icon: Sparkles,
    name: 'Custom',
    subtitle: 'Til særlige projekter, SaaS, dashboards eller avancerede løsninger.',
    price: 'Efter aftale',
    color: '#34D399',
    popular: false,
    cta: 'Kontakt os',
    features: [
      'Skræddersyet løsning',
      '3D / animation',
      'Webapp eller dashboard',
      'API-integrationer',
      'AI-workflows',
      'Specialfunktioner',
    ],
  },
]

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const scrollToContact = () => {
    const el = document.querySelector('#kontakt')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="priser" className="relative py-24 lg:py-32 bg-dark-900">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.6) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-purple-300 glass border border-purple-500/20 mb-4">
            Priser
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Pakker til virksomheder{' '}
            <span className="gradient-text">i forskellige stadier</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Vælg den pakke der passer til din virksomheds behov og budget. Alle priser er vejledende.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
                  plan.popular
                    ? 'border-violet-500/50 shadow-neon-purple'
                    : 'border-white/8 hover:border-white/18'
                }`}
                style={{
                  background: plan.popular
                    ? 'linear-gradient(145deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))'
                    : 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <span className="px-4 py-1 text-xs font-bold text-white rounded-b-xl bg-gradient-to-r from-violet-600 to-blue-500">
                      Mest populær
                    </span>
                  </div>
                )}

                <div className={`p-7 flex flex-col flex-1 ${plan.popular ? 'pt-10' : ''}`}>
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}35` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: plan.color }} />
                    </div>
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                  </div>

                  <p className="text-sm text-gray-400 mb-6 leading-relaxed min-h-[3rem]">{plan.subtitle}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <Check
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: plan.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    onClick={scrollToContact}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      plan.popular
                        ? 'text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:shadow-neon-purple'
                        : 'text-white border'
                    }`}
                    style={
                      !plan.popular
                        ? {
                            background: `${plan.color}15`,
                            borderColor: `${plan.color}40`,
                            color: plan.color,
                          }
                        : undefined
                    }
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Alle priser er vejledende og afhænger af projektets størrelse, indhold og funktioner.
        </motion.p>
      </div>
    </section>
  )
}
