import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ma Web Agency – Moderne hjemmesider til lokale virksomheder',
  description:
    'Ma Web Agency hjælper lokale virksomheder med moderne hjemmesider, stærkere online synlighed og flere henvendelser. Få et gratis website-tjek i dag.',
  keywords: 'hjemmeside, webbureau, lokale virksomheder, SEO, webdesign, landing page',
  openGraph: {
    title: 'Ma Web Agency – Moderne hjemmesider til lokale virksomheder',
    description: 'Professionelle hjemmesider der skaffer kunder. Kontakt Ma Web Agency og få et gratis website-tjek.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className="dark">
      <body className="bg-dark-950 text-gray-100 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15,15,46,0.95)',
              color: '#f9fafb',
              border: '1px solid rgba(139,92,246,0.3)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </body>
    </html>
  )
}
