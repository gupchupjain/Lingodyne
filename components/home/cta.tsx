import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Certified?</h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have advanced their careers with our internationally recognized language
          certificates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3" asChild>
            <Link href="/demo">
              Start Free Demo
              <Play className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3"
            asChild
          >
            <Link href="/languages">
              Browse Languages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-green-100 text-sm">
          ✓ No subscription required ✓ Human-evaluated ✓ Instant verification
        </div>
      </div>
    </section>
  )
}
