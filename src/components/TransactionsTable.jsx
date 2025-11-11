import React from 'react'
import { format } from 'date-fns'

export default function TransactionsTable({ items = [], onEdit, onDelete }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/40 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-white/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map(tx => (
            <tr key={tx.id} className="hover:bg-white/60 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{tx.description || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{tx.category}</td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${tx.type==='expense' ? 'text-red-500' : 'text-emerald-600'}`}>
                {tx.type==='expense' ? '-' : '+'}${tx.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={()=>onEdit(tx)} className="text-blue-600 hover:underline mr-3">Edit</button>
                <button onClick={()=>onDelete(tx)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
