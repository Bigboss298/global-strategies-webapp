import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/Card'
import { ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Activities = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    {
      id: '1',
      name: 'NPNGS Protocols',
      description: 'Frameworks, standards, and digital governance systems that operationalize neutrality — enabling interoperable trade, finance, and...',
      imageUrl: '/api/placeholder/400/250',
    },
    {
      id: '2',
      name: 'Infrastructure Systems',
      description: 'Strategic, modular infrastructure assets — including energy, logistics, and digital corridors — that anchor neutral trade and collaboration...',
      imageUrl: '/api/placeholder/400/250',
    },
    {
      id: '3',
      name: 'City & Regional Development',
      description: 'The transformation of cities and regions into neutral innovation and trade hubs, through integrated planning, clean energy transition,...',
      imageUrl: '/api/placeholder/400/250',
    },
    {
      id: '4',
      name: 'Sovereign & Multipolar Initiatives',
      description: 'This focuses on aligning sovereign and multilateral initiatives with neutral governance models, fostering interoperability between global..',
      imageUrl: '/api/placeholder/400/250',
    },
    {
      id: '5',
      name: 'Software & Digital Platforms',
      description: 'Core digital engines that power TBP operations — such as data interoperability tools, trade registries, and smart-contract systems — ensuring transparency...',
      imageUrl: '/api/placeholder/400/250',
    },
    {
      id: '6',
      name: 'Event Systems & Global Engagements',
      description: 'Design, management, and delivery of TBP-led summits, forums, conferences, and pilot events that advance the NPNGS vision and...',
      imageUrl: '/api/placeholder/400/250',
    },
  ]

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">TBP Project Categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-teal-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                </div>
              </div>
              <CardHeader>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Learn more
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Center Section */}
        <div className="mt-16 relative">
          <div className="h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl font-bold text-white mb-6">NPNGS Strategist Resource Center</h2>
              <p className="text-white text-lg max-w-3xl mb-8">
                Gain access to exclusive guides, frameworks, and expert-curated TBP DESQUELET™ materials designed to
                help you innovate, build, and lead within the next generation of the Neo-Polar Neutrality Global System
                (NPNGS). Develop your skills, accelerate your impact, and stay ahead of the global shift — all in one
                place.
              </p>
              <Button variant="outline" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Explore Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-md shadow-lg hover:bg-blue-700 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

