"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Search, MapPin, Building, ExternalLink, CheckCircle, Globe, DollarSign } from "lucide-react"

// Mock job data
const mockJobs = [
  {
    id: "job-001",
    title: "Senior Software Engineer",
    company: "TechCorp International",
    location: "Berlin, Germany",
    remote: true,
    salary: "€70,000 - €90,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Join our international team building next-generation software solutions.",
    posted: "2 days ago",
    type: "Full-time",
  },
  {
    id: "job-002",
    title: "Marketing Manager",
    company: "Global Marketing Solutions",
    location: "Barcelona, Spain",
    remote: false,
    salary: "€45,000 - €55,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Lead marketing campaigns for our European expansion.",
    posted: "1 week ago",
    type: "Full-time",
  },
  {
    id: "job-003",
    title: "Customer Success Specialist",
    company: "SaaS Innovations",
    location: "Remote",
    remote: true,
    salary: "$50,000 - $65,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Help our international customers succeed with our platform.",
    posted: "3 days ago",
    type: "Full-time",
  },
  {
    id: "job-004",
    title: "Business Analyst",
    company: "Finance Plus",
    location: "London, UK",
    remote: false,
    salary: "£40,000 - £50,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Analyze business processes and drive improvements.",
    posted: "5 days ago",
    type: "Full-time",
  },
  {
    id: "job-005",
    title: "Project Coordinator",
    company: "International Consulting",
    location: "Paris, France",
    remote: true,
    salary: "€38,000 - €45,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Coordinate international projects across multiple time zones.",
    posted: "1 week ago",
    type: "Contract",
  },
  {
    id: "job-006",
    title: "Sales Representative",
    company: "Export Solutions",
    location: "Amsterdam, Netherlands",
    remote: false,
    salary: "€42,000 - €55,000",
    requiredLanguage: "English",
    certificateAccepted: true,
    description: "Drive sales growth in international markets.",
    posted: "4 days ago",
    type: "Full-time",
  },
]

const languages = ["All Languages", "English", "German", "Spanish", "French", "Italian", "Portuguese"]
const countries = ["All Countries", "Germany", "Spain", "United Kingdom", "France", "Netherlands", "Remote"]

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [showRemoteOnly, setShowRemoteOnly] = useState(false)

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === "All Languages" || job.requiredLanguage === selectedLanguage
    const matchesCountry =
      selectedCountry === "All Countries" ||
      job.location.includes(selectedCountry) ||
      (selectedCountry === "Remote" && job.remote)
    const matchesRemote = !showRemoteOnly || job.remote

    return matchesSearch && matchesLanguage && matchesCountry && matchesRemote
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Briefcase className="w-5 h-5" />
            <span>Job Opportunities</span>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Find international jobs that accept our English proficiency certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-indigo-100 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Certificate accepted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>International opportunities</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>Verified employers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-green-600" />
            <span>Search Jobs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Filters */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRemoteOnly}
                  onChange={(e) => setShowRemoteOnly(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Found
          </h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            All accept our certificates
          </Badge>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{job.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.certificateAccepted && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Certificate Accepted
                            </Badge>
                          )}
                          {job.remote && (
                            <Badge variant="secondary" className="text-xs">
                              Remote
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>Requires {job.requiredLanguage}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-500">Posted {job.posted}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <Button
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        asChild
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLanguage("All Languages")
                  setSelectedCountry("All Countries")
                  setShowRemoteOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
