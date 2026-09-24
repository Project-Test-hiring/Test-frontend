import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { api } from '../services/api'
import { DataState } from '../components/ui/DataState'

interface Transaction {
  id: string
  name?: string
  merchantName?: string
  amount: number
  date: string
  category?: string
}

/**
 * Live exercise (10–15 min) — see ASSIGNMENT.md
 *
 * The list already loads. Add:
 * 1. A search box that filters by merchant or name
 * 2. Category filter (one or more)
 * 3. Empty state when nothing matches
 */
export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api
      .get<Transaction[]>('/transactions?limit=200')
      .then(setTransactions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load transactions'))
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const label = (t: Transaction) => t.merchantName || t.name || 'Other'

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Activity</p>
        <h1 className="page-title mt-1">Transactions</h1>
      </div>

      <DataState
        loading={loading}
        error={error}
        empty={!loading && !error && transactions.length === 0}
        emptyMessage="No transactions yet."
      >
        <div className="space-y-2">
          {transactions.map((t) => (
            <Card key={t.id} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <p className="font-medium text-surface-900 dark:text-white truncate">{label(t)}</p>
                <p className="text-sm text-surface-500">
                  {fmtDate(t.date)}
                  {t.category && ` • ${t.category}`}
                </p>
              </div>
              <p className={`font-semibold shrink-0 ${Number(t.amount) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Number(t.amount) < 0 ? '-' : '+'}${Math.abs(Number(t.amount)).toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      </DataState>
    </div>
  )
}
