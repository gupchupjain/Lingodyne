import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const languages = [
  {
    name: "English",
    flag: "🇺🇸",
    level: "A1 - C2",
    price: "$49",
    popular: true,
    description: "Most requested for international jobs",
  },
  {
    name: "German",
    flag: "🇩🇪",
    level: "A1 - C2",
    price: "$59",
    popular: false,
    description: "Essential for European job market",
  },
  {
    name: "Spanish",
    flag: "🇪🇸",
    level: "A1 - C2",
    price: "$49",
    popular: true,
    description: "Growing demand in global business",
  },
  {
    name: "French",
    flag: "🇫🇷",
    level: "A1 - C2",
    price: "$59",
    popular: false,
    description: "Required for many international roles",
  },
  {
    name: "Italian",
    flag: "🇮🇹",
    level: "A1 - C2",
    price: "$54",
    popular: false,
    description: "Perfect for European opportunities",
  },
  {
    name: "Portuguese",
    flag: "🇵🇹",
    level: "A1 - C2",
    price: "$54",
    popular: false,
    description: "High demand in Latin American markets",
  },
]

export default function Languages() {
  return (
    <section id="languages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Language</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get certified in the language that will advance your career. All tests follow international standards and
            are recognized globally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-lg transition-shadow duration-300 ${language.popular ? "ring-2 ring-green-500" : ""}`}
            >
              {language.popular && (
                <Badge className="absolute -top-2 left-4 bg-green-500 text-white">Most Popular</Badge>
              )}
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{language.flag}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{language.name}</h3>
                      <p className="text-sm text-gray-500">Levels: {language.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{language.price}</div>
                    <div className="text-sm text-gray-500">per test</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{language.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reading & Writing</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Speaking & Listening</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Human Evaluation</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Certificate & QR</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    asChild
                  >
                    <Link href={`/purchase/${language.name.toLowerCase()}`}>Buy Test</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/demo">Try Free Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Don't see your language?</p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Request New Language</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
