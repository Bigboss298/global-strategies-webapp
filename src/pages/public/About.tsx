import { Check } from 'lucide-react'

export const About = () => {
  const opportunities = [
    'Gain visibility as a global thought leader in trade, energy, and governance innovation',
    'Influence the design of new global systems at the intersection of policy, technology, and infrastructure',
    'Engage directly with governments, institutions, and industry leaders',
    'Contribute to TBP publications, summits, and international conferences',
    'Be recognized as a contributor to one of the most ambitious global initiatives of our time',
    'Work with Neo-Polar Neutrality Global System (NPNGS) Charter House, the forthcoming seat of the Governing Council —proposed to be headquartered in the Middle East — helping to shape global charters, protocols, and frameworks for neutral trade, energy, and sustainability',
  ]

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">About TBP Global Strategist</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            The Borderless Project (TBP) is building a new global system for trade, energy, and cooperation. We are
            looking for exceptional minds ready to co-create history.
          </p>

          <p>
            At the heart of this effort is the Neo-Polar Neutrality System — a bold framework to move beyond gridlocked
            multilateralism and enable nations, businesses, and citizens to engage through neutral trade corridors,
            interoperable infrastructure, and shared digital/physical protocols — while preserving their sovereign
            identity. To shape this vision, we are inviting visionary thinkers and practitioners to join TBP as Global
            Strategists.
          </p>

          <p>
            This is not a traditional paid role. Instead, it is a fellowship-style opportunity to:
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-green-500 flex items-center justify-center bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-700 flex-1">{opportunity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

