import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Lingodyne helped me land my dream job in Germany. The certificate was immediately recognized by my employer, and the human evaluation gave me confidence in my results.",
  },
  {
    name: "Miguel Rodriguez",
    role: "Marketing Manager",
    company: "Microsoft",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The test format was comprehensive and professional. I appreciated the detailed feedback from the evaluators, which helped me understand my strengths and areas for improvement.",
  },
  {
    name: "Emma Thompson",
    role: "Business Analyst",
    company: "Amazon",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "I needed a Spanish certificate for a promotion, and Lingodyne delivered exactly what I needed. The QR verification feature impressed my HR department.",
  },
  {
    name: "David Kim",
    role: "Product Designer",
    company: "Meta",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The platform is user-friendly and the test experience was smooth. Getting my English certificate opened doors to international opportunities I never thought possible.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have advanced their careers with Lingodyne language certificates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Quote className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.text}"</p>

                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <div className="flex items-center">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9/5 from 2,847 reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
