import { useEffect, useMemo, useState } from 'react'
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

export default function Recurring() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<Transaction[]>('/transactions?limit=200')
      .then(setTransactions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load transactions'))
      .finally(() => setLoading(false))
  }, [])

  // 3+ hits on the same merchant, skip Income
  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of transactions) {
      if (t.category === 'Income') continue
      const key = (t.merchantName || t.name || 'Other').trim()
      const list = map.get(key) ?? []
      list.push(t)
      map.set(key, list)
    }
    return [...map.entries()]
      .filter(([, rows]) => rows.length >= 3)
      .map(([merchant, rows]) => {
        const abs = rows.map((r) => Math.abs(Number(r.amount)))
        const typical = abs.reduce((s, n) => s + n, 0) / abs.length
        const last = rows.reduce((a, b) => (a.date > b.date ? a : b))
        return { merchant, count: rows.length, typical, lastDate: last.date, monthly: typical }
      })
      .sort((a, b) => b.count - a.count)
  }, [transactions])

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Patterns</p>
        <h1 className="page-title mt-1">Recurring</h1>
      </div>

      <DataState
        loading={loading}
        error={error}
        empty={!loading && !error && groups.length === 0}
        emptyMessage="No repeating merchants yet."
      >
        <div className="space-y-2">
          {groups.map((g) => (
            <Card key={g.merchant} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-surface-900 dark:text-white">{g.merchant}</p>
                <p className="text-sm text-surface-500">
                  {g.count} times · last {new Date(g.lastDate).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-surface-900 dark:text-white">~${g.typical.toFixed(2)}</p>
            </Card>
          ))}
        </div>
      </DataState>
    </div>
  )
}
