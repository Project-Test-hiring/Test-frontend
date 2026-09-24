import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { api } from '../services/api'
import { DataState } from '../components/ui/DataState'

interface Budget {
  id: string
  name: string
  category: string
  amount: number
}

interface InsightCategory {
  category: string
  spent: number
  budget: number | null
  overBudget?: boolean
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      api.get<Budget[]>('/budgets'),
      api.get<{ byCategory: InsightCategory[] }>('/insights/monthly'),
    ])
      .then(([list, insights]) => {
        setBudgets(list)
        const map: Record<string, number> = {}
        for (const row of insights.byCategory ?? []) map[row.category] = row.spent
        setSpentByCategory(map)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load budgets'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Planning</p>
        <h1 className="page-title mt-1">Budgets</h1>
      </div>

      <DataState
        loading={loading}
        error={error}
        empty={!loading && !error && budgets.length === 0}
        emptyMessage="No budgets yet."
      >
        <div className="space-y-2">
          {budgets.map((b) => {
            const spent = spentByCategory[b.category] ?? 0
            const pct = b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0
            const over = spent > b.amount
            return (
              <Card key={b.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 dark:text-white">{b.name}</p>
                    <p className="text-sm text-surface-500">{b.category}</p>
                  </div>
                  <p className={`font-semibold shrink-0 ${over ? 'text-red-600' : 'text-surface-900 dark:text-white'}`}>
                    ${spent.toFixed(0)} / ${Number(b.amount).toFixed(0)}
                  </p>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-red-500' : 'bg-primary-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </DataState>
    </div>
  )
}
