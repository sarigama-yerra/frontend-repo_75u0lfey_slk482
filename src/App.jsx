import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowDownRight, ArrowUpRight, Search, Plus, Filter } from 'lucide-react'
import SummaryCard from './components/SummaryCard'
import ChartOverview from './components/ChartOverview'
import TransactionsTable from './components/TransactionsTable'
import TransactionForm from './components/TransactionForm'
import HeroSpline from './components/HeroSpline'

const STORAGE_KEY = 'expense_tracker_transactions_v1'

const defaultData = [
  { id: '1', type: 'expense', amount: 35.5, category: 'Food', date: new Date().toISOString().substring(0,10), description: 'Lunch' },
  { id: '2', type: 'income', amount: 1200, category: 'Income', date: new Date().toISOString().substring(0,10), description: 'Salary' },
  { id: '3', type: 'expense', amount: 60, category: 'Transport', date: new Date().toISOString().substring(0,10), description: 'Fuel' },
]

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultData
    return parsed
  } catch {
    return defaultData
  }
}

function saveTransactions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function formatCurrency(n) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

const categories = ['All','General','Food','Transport','Housing','Shopping','Health','Entertainment','Travel','Income']

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { saveTransactions(transactions) }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesQuery = [t.description, t.category].join(' ').toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || t.category === category
      const d = new Date(t.date)
      const fromOk = !dateRange.from || d >= new Date(dateRange.from)
      const toOk = !dateRange.to || d <= new Date(dateRange.to)
      return matchesQuery && matchesCategory && fromOk && toOk
    }).sort((a,b)=> new Date(b.date)-new Date(a.date))
  }, [transactions, query, category, dateRange])

  const totals = useMemo(() => {
    const income = filtered.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
    const expenses = filtered.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)
    return { income, expenses, balance: income - expenses }
  }, [filtered])

  const byCategory = useMemo(() => {
    const map = {}
    filtered.forEach(t => {
      const key = t.category
      const val = t.type === 'expense' ? t.amount : 0
      map[key] = (map[key]||0) + val
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const byTime = useMemo(() => {
    // group by month
    const map = {}
    filtered.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      if (!map[key]) map[key] = { name: key, expense: 0, income: 0 }
      map[key][t.type === 'expense' ? 'expense' : 'income'] += t.amount
    })
    return Object.values(map).sort((a,b)=> a.name.localeCompare(b.name))
  }, [filtered])

  const handleCreateOrUpdate = (tx) => {
    setTransactions(list => {
      const exists = list.some(i => i.id === tx.id)
      const updated = exists ? list.map(i => i.id === tx.id ? tx : i) : [tx, ...list]
      return updated
    })
    setOpenForm(false)
    setEditing(null)
  }

  const handleEdit = (tx) => { setEditing(tx); setOpenForm(true) }
  const handleDelete = (tx) => { setTransactions(list => list.filter(i => i.id !== tx.id)) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center shadow"><Wallet size={22} /></div>
            <h1 className="text-2xl font-semibold text-gray-900">Expense Tracker</h1>
          </div>
          <button onClick={()=>{setEditing(null); setOpenForm(true)}} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow hover:opacity-90">
            <Plus size={18}/> Add Transaction
          </button>
        </header>

        <HeroSpline />

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <SummaryCard title="Total Expenses" amount={formatCurrency(totals.expenses)} icon={ArrowDownRight} color="from-rose-400 to-rose-500" />
          <SummaryCard title="Total Income" amount={formatCurrency(totals.income)} icon={ArrowUpRight} color="from-emerald-400 to-emerald-500" />
          <SummaryCard title="Balance" amount={formatCurrency(totals.balance)} icon={Wallet} color="from-blue-400 to-emerald-400" />
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur" placeholder="Search transactions..." />
              </div>
              <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white/70">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" value={dateRange.from} onChange={(e)=>setDateRange(r=>({...r,from:e.target.value}))} className="px-3 py-2 rounded-xl border border-gray-200 bg-white/70" />
              <span className="text-gray-400">to</span>
              <input type="date" value={dateRange.to} onChange={(e)=>setDateRange(r=>({...r,to:e.target.value}))} className="px-3 py-2 rounded-xl border border-gray-200 bg-white/70" />
            </div>
            <TransactionsTable items={filtered} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
          <div className="lg:col-span-1">
            <ChartOverview byCategory={byCategory} byTime={byTime} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openForm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} transition={{type:'spring', stiffness:260, damping:20}} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{editing? 'Edit' : 'Add'} Transaction</h3>
                <button onClick={()=>{setOpenForm(false); setEditing(null)}} className="text-gray-500">✕</button>
              </div>
              <TransactionForm initial={editing} onSubmit={handleCreateOrUpdate} onCancel={()=>{setOpenForm(false); setEditing(null)}} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
