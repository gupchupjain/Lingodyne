import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Free Demo",
    price: "$0",
    description: "Try our platform with a sample test",
    features: [
      "Sample questions from all sections",
      "15-minute demo test",
      "Basic score feedback",
      "No certificate included",
    ],
    buttonText: "Start Free Demo",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Single Test",
    price: "$49",
    description: "Perfect for one-time certification",
    features: [
      "Complete 4-section test",
      "Human expert evaluation",
      "Detailed feedback report",
      "Official certificate with QR",
      "Unlimited retakes (additional fee)",
      "Email support",
    ],
    buttonText: "Buy Single Test",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Multi-Language Pack",
    price: "$129",
    originalPrice: "$196",
    description: "Get certified in 3 languages",
    features: [
      "Choose any 3 languages",
      "All single test features",
      "Priority evaluation (48h)",
      "Advanced analytics",
      "Phone support",
      "Valid for 6 months",
    ],
    buttonText: "Buy Language Pack",
    buttonVariant: "default" as const,
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All tests include human evaluation and official certificates
            recognized by employers worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "ring-2 ring-green-500 shadow-xl" : "shadow-lg"} hover:shadow-xl transition-shadow duration-300`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Most Popular</span>
                </Badge>
              )}

              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.buttonVariant === "default" ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" : ""}`}
                  variant={plan.buttonVariant}
                  size="lg"
                  asChild
                >
                  <Link
                    href={
                      plan.name === "Free Demo"
                        ? "/demo"
                        : plan.name === "Multi-Language Pack"
                          ? "/purchase/multi"
                          : "/purchase"
                    }
                  >
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom solution for your organization?</p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
