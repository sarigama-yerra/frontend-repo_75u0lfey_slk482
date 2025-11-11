import React from 'react'

export default function SummaryCard({ title, amount, icon: Icon, color = 'from-blue-500 to-cyan-500' }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur border border-white/40 shadow-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 pointer-events-none`} />
      <div className="p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/60 to-white/20 border border-white/40 shadow-inner flex items-center justify-center">
          {Icon && <Icon className="h-6 w-6 text-blue-600" />}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{amount}</p>
        </div>
      </div>
    </div>
  )
}
