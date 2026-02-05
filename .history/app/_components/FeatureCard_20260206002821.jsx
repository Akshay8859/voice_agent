import React from 'react'

const FeatureCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary transition">
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-400 text-sm">{description}</p>
    </div>
  )
}

export default FeatureCard