"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How long does it take to get my test results?",
    answer:
      "Our expert evaluators typically review and score tests within 3-5 business days. You'll receive an email notification when your results are ready, along with your certificate if you passed.",
  },
  {
    question: "Are the certificates recognized by employers?",
    answer:
      "Yes! Our certificates are recognized by employers worldwide. Each certificate includes a unique QR code and certificate ID that employers can use to instantly verify your results on our platform.",
  },
  {
    question: "What happens if I don't pass the test?",
    answer:
      "If you don't achieve a passing score, you'll receive detailed feedback on areas for improvement. You can retake the test after 30 days with a 50% discount on your next attempt.",
  },
  {
    question: "Can I take the test multiple times?",
    answer:
      "Yes, you can retake any test. However, there's a 30-day waiting period between attempts to ensure you have time to improve your skills. Retakes are offered at a discounted rate.",
  },
  {
    question: "What equipment do I need for the test?",
    answer:
      "You'll need a computer with a stable internet connection, a microphone for the speaking section, and a quiet environment. We'll test your equipment before the test begins.",
  },
  {
    question: "How long is my certificate valid?",
    answer:
      "Our certificates don't expire, but many employers prefer certificates issued within the last 2 years. The certificate will always show the date it was issued for employer reference.",
  },
  {
    question: "Can I pause the test and resume later?",
    answer:
      "Yes! You can save your progress and resume the test within 7 days of starting. However, individual timed sections must be completed in one sitting once started.",
  },
  {
    question: "What languages do you currently offer?",
    answer:
      "We currently offer tests in English, German, Spanish, French, Italian, and Portuguese. We're constantly adding new languages based on demand. Contact us if you need a specific language.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about our language certification tests.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="space-x-4">
            <a href="mailto:support@linguacert.com" className="text-blue-600 hover:text-blue-800 font-medium">
              Email Support
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
