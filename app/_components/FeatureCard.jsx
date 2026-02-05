import React from 'react'

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-md transition">
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default FeatureCard