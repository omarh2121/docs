'use client'

import { motion } from 'framer-motion'
import { Zap, Mail, ArrowUp } from 'lucide-react'

const footerLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Proces', href: '#proces' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Priser', href: '#priser' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-dark-950 border-t border-white/8 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[200px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 mb-5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-neon-purple">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Ma Web<span className="gradient-text"> Agency</span>
              </span>
            </button>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Ma Web Agency bygger moderne hjemmesider og digitale løsninger til virksomheder,
              der vil fremstå professionelle online og få flere kunder.
            </p>
            <a
              href="mailto:zyflexzyflex@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-300 transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
              zyflexzyflex@gmail.com
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA block */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Kom i gang
            </h4>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Få et gratis website-tjek og se hvad din virksomhed kan forbedre online.
            </p>
            <motion.button
              onClick={() => scrollTo('#kontakt')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:shadow-neon-purple transition-all duration-300"
            >
              Gratis website-tjek
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 Ma Web Agency. Alle rettigheder forbeholdes.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -2 }}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Tilbage til toppen
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
