import Hero from "@/components/home/hero"
import Features from "@/components/home/features"
import Languages from "@/components/home/languages"
import TestFormat from "@/components/home/test-format"
import Pricing from "@/components/home/pricing"
import Testimonials from "@/components/home/testimonials"
import FAQ from "@/components/home/faq"
import CTA from "@/components/home/cta"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Languages />
        <TestFormat />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
