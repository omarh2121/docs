'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Hvor lang tid tager det at få en hjemmeside?',
    a: 'Typisk mellem 3 og 14 dage afhængigt af størrelse, indhold og rettelser. En simpel landing page kan leveres hurtigere, mens en komplet hjemmeside med flere sider tager lidt længere.',
  },
  {
    q: 'Kan I hjælpe med tekst?',
    a: 'Ja. Vi kan hjælpe med professionel dansk tekst, struktur og CTA\'er. Vi ved, hvad der konverterer, og skriver tekst der appellerer til din målgruppe.',
  },
  {
    q: 'Kan siden bruges på mobil?',
    a: 'Ja. Alle hjemmesider bygges responsivt, så de virker perfekt på mobil, tablet og computer. Vi tester på tværs af enheder, inden siden leveres.',
  },
  {
    q: 'Kan I lave SEO?',
    a: 'Ja. Vi kan bygge en SEO-klar struktur med gode overskrifter, metadata og lokal relevans. Det sikrer, at din virksomhed er lettere at finde på Google for relevante søgninger.',
  },
  {
    q: 'Kan I lave booking eller kontaktformular?',
    a: 'Ja. Vi kan tilføje kontaktformular, bookinglink, Google Maps og tydelige kontaktknapper. Kontaktflow er en kernedel af det vi bygger.',
  },
  {
    q: 'Kan I lave AI-chatbot?',
    a: 'Ja. Vi kan hjælpe med simple AI-chatbots og automatiseringer til kundeservice eller leadgenerering. Det kan spare dig tid og sikre hurtige svar til dine kunder.',
  },
  {
    q: 'Skal jeg selv have billeder og logo?',
    a: 'Det er bedst, hvis du har det. Hvis ikke, kan vi lave en professionel midlertidig løsning og hjælpe med struktur, stockbilleder og eventuelt en simpel visuelt stil.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="border border-white/8 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/15"
      style={{ background: open ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-white leading-snug pr-4">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-dark-950">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute right-0 top-1/4 w-[400px] h-[400px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-indigo-300 glass border border-indigo-500/20 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Ofte stillede{' '}
            <span className="gradient-text">spørgsmål</span>
          </h2>
          <p className="text-lg text-gray-400">
            Har du et spørgsmål der ikke er besvaret her? Kontakt os direkte.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
