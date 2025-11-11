import React, { useEffect, useState } from 'react'

const defaultForm = {
  id: null,
  type: 'expense',
  amount: '',
  category: 'General',
  date: new Date().toISOString().substring(0, 10),
  description: ''
}

const categories = [
  'General', 'Food', 'Transport', 'Housing', 'Shopping', 'Health', 'Entertainment', 'Travel', 'Income'
]

export default function TransactionForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) setForm({ ...defaultForm, ...initial })
  }, [initial])

  const validate = () => {
    const e = {}
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Select a date'
    if (!form.category) e.category = 'Choose a category'
    if (!form.type) e.type = 'Select type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, id: form.id || crypto.randomUUID(), amount: Number(form.amount) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Type</label>
          <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))} className="mt-1 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-600">Amount</label>
          <input value={form.amount} onChange={(e)=>setForm(f=>({...f,amount:e.target.value}))} type="number" step="0.01" className="mt-1 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" placeholder="0.00" />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Category</label>
          <select value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} className="mt-1 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-600">Date</label>
          <input value={form.date} onChange={(e)=>setForm(f=>({...f,date:e.target.value}))} type="date" className="mt-1 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <input value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} type="text" className="mt-1 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" placeholder="Optional" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow hover:opacity-90">Save</button>
      </div>
    </form>
  )
}
