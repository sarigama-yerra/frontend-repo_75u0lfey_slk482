import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#60a5fa', '#34d399', '#f59e0b', '#f472b6', '#f87171', '#c084fc']

export default function ChartOverview({ byCategory = [], byTime = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/40 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/40 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Spending Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
