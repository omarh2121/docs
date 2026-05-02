'use client'

import Navbar from '@/components/Navbar'
import Hero3D from '@/components/Hero3D'
import ProblemSection from '@/components/ProblemSection'
import ServicesSection from '@/components/ServicesSection'
import ProcessSection from '@/components/ProcessSection'
import PortfolioSection from '@/components/PortfolioSection'
import BenefitsSection from '@/components/BenefitsSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950 overflow-x-hidden">
      <Navbar />
      <Hero3D />
      <ProblemSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <BenefitsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
