'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, CheckCircle2, Send, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const services = [
  'Hjemmeside',
  'Landing page',
  'SEO-struktur',
  'Branding',
  'Booking / kontaktflow',
  'AI-chatbot',
  'Noget andet',
]

interface FormData {
  name: string
  company: string
  email: string
  phone: string
  service: string
  message: string
}

const emptyForm: FormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Navn er påkrævet'
    if (!form.email.trim()) e.email = 'Email er påkrævet'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ugyldig email'
    if (!form.message.trim()) e.message = 'Besked er påkrævet'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    toast.success('Besked sendt! Vi vender tilbage hurtigst muligt.', { duration: 5000 })
  }

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 glass border ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-400'
        : 'border-white/10 focus:border-violet-500/50'
    } focus:ring-2 focus:ring-violet-500/20`

  return (
    <section id="kontakt" className="relative py-24 lg:py-32 bg-dark-900">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[350px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)' }}
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
            Kontakt
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Vil du have en hjemmeside, der{' '}
            <span className="gradient-text">arbejder for din virksomhed?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Send en besked og få et gratis website-tjek eller en kort vurdering af, hvad din
            virksomhed kan forbedre online.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left – info cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            {[
              {
                icon: Mail,
                color: '#A78BFA',
                title: 'Email',
                value: 'zyflexzyflex@gmail.com',
                sub: 'Svar typisk inden for 24 timer',
              },
              {
                icon: CheckCircle2,
                color: '#34D399',
                title: 'Gratis website-tjek',
                value: 'Ingen forpligtelse',
                sub: 'Vi gennemgår din nuværende side og giver konkret feedback',
              },
              {
                icon: ArrowRight,
                color: '#60A5FA',
                title: 'Hurtig vurdering',
                value: 'Inden for 48 timer',
                sub: 'Få svar på, hvad din virksomhed kan forbedre online',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}35` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.title}</p>
                      <p className="text-sm font-semibold text-white mb-0.5">{item.value}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* CTA buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="mailto:zyflexzyflex@gmail.com"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:shadow-neon-purple transition-all duration-300 hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                Få gratis website-tjek
              </a>
              <a
                href="mailto:zyflexzyflex@gmail.com?subject=Kontakt Ma Web Agency"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-gray-200 glass border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Kontakt Ma Web Agency
              </a>
            </div>
          </motion.div>

          {/* Right – form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <div className="glass-strong rounded-2xl p-8 border border-white/10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Tak for din besked!</h3>
                  <p className="text-gray-400 max-w-sm">
                    Vi har modtaget din henvendelse og vender tilbage inden for 24 timer.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm) }}
                    className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 glass border border-white/10 hover:border-violet-500/30 transition-all"
                  >
                    Send en ny besked
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Navn <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Dit navn"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass('name')}
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Virksomhed
                      </label>
                      <input
                        type="text"
                        placeholder="Firmanavn (valgfrit)"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className={inputClass('company')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="din@email.dk"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass('email')}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        placeholder="+45 XX XX XX XX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass('phone')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Hvad har du brug for?
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className={`${inputClass('service')} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Vælg en ydelse</option>
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-dark-800">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Besked <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Fortæl kort om din virksomhed og hvad du har brug for hjælp til..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass('message')} resize-none`}
                    />
                    {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 hover:shadow-neon-purple transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sender...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send besked
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-center text-gray-600">
                    Vi svarer typisk inden for 24 timer. Ingen spam, ingen forpligtelse.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
