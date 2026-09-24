/** In-browser stand-in for the old Express API. Data lives in localStorage. */

const STORE_KEY = 'verifi-mock-db-v1'

export class MockHttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'MockHttpError'
  }
}

const DEMO = {
  id: 'user-demo',
  email: 'demo@verifi.test',
  password: 'demo1234',
  firstName: 'Alex',
  lastName: 'Chen',
  role: 'user',
  walletAddress: null as string | null,
}

const ADMIN = {
  id: 'user-admin',
  email: 'admin@verifi.test',
  password: 'admin1234',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  walletAddress: null as string | null,
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

function publicUser(u: typeof DEMO | typeof ADMIN) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    walletAddress: u.walletAddress,
  }
}

type Tx = {
  id: string
  accountId: string
  amount: number
  date: string
  name: string
  merchantName: string
  category: string
  subcategory?: string
  notes?: string
}

type Budget = {
  id: string
  name: string
  category: string
  amount: number
  period: string
  startDate: string
  endDate: string | null
}

type Goal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate?: string | null
}

type Account = {
  id: string
  institutionName: string
  accountName: string
  accountType: string
  mask: string
  currentBalance: number
  linkedAt: string
  provider: string
  linkStatus: string
}

type Loan = {
  id: string
  amount: number
  status: string
  termMonths: number
  monthlyPayment: number
  interestRatePct: number
  appliedAt: string
}

type Db = {
  accounts: Account[]
  transactions: Tx[]
  budgets: Budget[]
  savings: Goal[]
  loans: Loan[]
  coach: { role: 'user' | 'assistant'; content: string }[]
  kycStatus: string
}

function seedDb(): Db {
  const checkingId = 'acct-checking'
  const savingsId = 'acct-savings'
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const txs: Omit<Tx, 'id'>[] = [
    { accountId: checkingId, amount: 3200, date: daysAgo(3), name: 'Payroll', merchantName: 'Acme Corp', category: 'Income' },
    { accountId: checkingId, amount: 3200, date: daysAgo(33), name: 'Payroll', merchantName: 'Acme Corp', category: 'Income' },
    { accountId: checkingId, amount: 3200, date: daysAgo(63), name: 'Payroll', merchantName: 'Acme Corp', category: 'Income' },
    { accountId: checkingId, amount: -1850, date: daysAgo(2), name: 'Rent', merchantName: 'Harbor Apartments', category: 'Bills' },
    { accountId: checkingId, amount: -1850, date: daysAgo(32), name: 'Rent', merchantName: 'Harbor Apartments', category: 'Bills' },
    { accountId: checkingId, amount: -1850, date: daysAgo(62), name: 'Rent', merchantName: 'Harbor Apartments', category: 'Bills' },
    { accountId: checkingId, amount: -15.99, date: daysAgo(5), name: 'Netflix', merchantName: 'Netflix', category: 'Entertainment' },
    { accountId: checkingId, amount: -15.99, date: daysAgo(36), name: 'Netflix', merchantName: 'Netflix', category: 'Entertainment' },
    { accountId: checkingId, amount: -15.99, date: daysAgo(66), name: 'Netflix', merchantName: 'Netflix', category: 'Entertainment' },
    { accountId: checkingId, amount: -10.99, date: daysAgo(8), name: 'Spotify', merchantName: 'Spotify', category: 'Entertainment' },
    { accountId: checkingId, amount: -10.99, date: daysAgo(39), name: 'Spotify', merchantName: 'Spotify', category: 'Entertainment' },
    { accountId: checkingId, amount: -10.99, date: daysAgo(70), name: 'Spotify', merchantName: 'Spotify', category: 'Entertainment' },
    { accountId: checkingId, amount: -49, date: daysAgo(6), name: 'Gym', merchantName: 'Ironclad Fitness', category: 'Health' },
    { accountId: checkingId, amount: -49, date: daysAgo(37), name: 'Gym', merchantName: 'Ironclad Fitness', category: 'Health' },
    { accountId: checkingId, amount: -92.4, date: daysAgo(11), name: 'Electric', merchantName: 'City Power', category: 'Bills' },
    { accountId: checkingId, amount: -88.1, date: daysAgo(42), name: 'Electric', merchantName: 'City Power', category: 'Bills' },
    { accountId: checkingId, amount: -64.2, date: daysAgo(1), name: 'Groceries', merchantName: 'Whole Foods', category: 'Groceries' },
    { accountId: checkingId, amount: -51.8, date: daysAgo(8), name: 'Groceries', merchantName: 'Whole Foods', category: 'Groceries' },
    { accountId: checkingId, amount: -72.15, date: daysAgo(15), name: 'Groceries', merchantName: 'Whole Foods', category: 'Groceries' },
    { accountId: checkingId, amount: -43.9, date: daysAgo(22), name: 'Groceries', merchantName: "Trader Joe's", category: 'Groceries' },
    { accountId: checkingId, amount: -58.3, date: daysAgo(29), name: 'Groceries', merchantName: 'Whole Foods', category: 'Groceries' },
    { accountId: checkingId, amount: -6.75, date: daysAgo(0), name: 'Coffee', merchantName: 'Starbucks', category: 'Food and Drink' },
    { accountId: checkingId, amount: -5.45, date: daysAgo(2), name: 'Coffee', merchantName: 'Starbucks', category: 'Food and Drink' },
    { accountId: checkingId, amount: -7.1, date: daysAgo(7), name: 'Coffee', merchantName: 'Starbucks', category: 'Food and Drink' },
    { accountId: checkingId, amount: -12.4, date: daysAgo(4), name: 'Lunch', merchantName: 'Sweetgreen', category: 'Food and Drink' },
    { accountId: checkingId, amount: -18.9, date: daysAgo(9), name: 'Dinner', merchantName: 'Chipotle', category: 'Food and Drink' },
    { accountId: checkingId, amount: -42.5, date: daysAgo(12), name: 'Dinner', merchantName: 'The Daily Table', category: 'Food and Drink' },
    { accountId: checkingId, amount: -14.2, date: daysAgo(3), name: 'Ride', merchantName: 'Uber', category: 'Transportation' },
    { accountId: checkingId, amount: -9.8, date: daysAgo(10), name: 'Ride', merchantName: 'Uber', category: 'Transportation' },
    { accountId: checkingId, amount: -21.6, date: daysAgo(16), name: 'Ride', merchantName: 'Uber', category: 'Transportation' },
    { accountId: checkingId, amount: -38, date: daysAgo(19), name: 'Gas', merchantName: 'Shell', category: 'Transportation' },
    { accountId: checkingId, amount: -86.2, date: daysAgo(13), name: 'Clothes', merchantName: 'Uniqlo', category: 'Shopping' },
    { accountId: checkingId, amount: -124.99, date: daysAgo(18), name: 'Headphones', merchantName: 'Amazon', category: 'Shopping' },
    { accountId: checkingId, amount: -29.5, date: daysAgo(25), name: 'Household', merchantName: 'Target', category: 'Shopping' },
    { accountId: checkingId, amount: -16, date: daysAgo(14), name: 'Movie', merchantName: 'AMC Theatres', category: 'Entertainment' },
    { accountId: checkingId, amount: 24.5, date: daysAgo(17), name: 'Refund', merchantName: 'Amazon', category: 'Shopping' },
    { accountId: savingsId, amount: 250, date: daysAgo(20), name: 'Transfer in', merchantName: 'Demo Bank', category: 'Transfer' },
    { accountId: savingsId, amount: 250, date: daysAgo(50), name: 'Transfer in', merchantName: 'Demo Bank', category: 'Transfer' },
  ]

  return {
    accounts: [
      {
        id: checkingId,
        institutionName: 'Demo Bank',
        accountName: 'Checking',
        accountType: 'checking',
        mask: '4242',
        currentBalance: 4820.55,
        linkedAt: daysAgo(80),
        provider: 'demo',
        linkStatus: 'linked',
      },
      {
        id: savingsId,
        institutionName: 'Demo Bank',
        accountName: 'Savings',
        accountType: 'savings',
        mask: '8810',
        currentBalance: 12450,
        linkedAt: daysAgo(80),
        provider: 'demo',
        linkStatus: 'linked',
      },
    ],
    transactions: txs.map((t, i) => ({ ...t, id: `tx-${i + 1}` })),
    budgets: [
      { id: 'b-1', name: 'Dining', category: 'Food and Drink', amount: 250, period: 'monthly', startDate: monthStart.toISOString(), endDate: null },
      { id: 'b-2', name: 'Groceries', category: 'Groceries', amount: 400, period: 'monthly', startDate: monthStart.toISOString(), endDate: null },
      { id: 'b-3', name: 'Transport', category: 'Transportation', amount: 180, period: 'monthly', startDate: monthStart.toISOString(), endDate: null },
      { id: 'b-4', name: 'Fun', category: 'Entertainment', amount: 80, period: 'monthly', startDate: monthStart.toISOString(), endDate: null },
      { id: 'b-5', name: 'Shopping', category: 'Shopping', amount: 200, period: 'monthly', startDate: monthStart.toISOString(), endDate: null },
    ],
    savings: [
      { id: 'g-1', name: 'Emergency fund', targetAmount: 8000, currentAmount: 3200, targetDate: daysAgo(-180) },
      { id: 'g-2', name: 'Japan trip', targetAmount: 3500, currentAmount: 900, targetDate: daysAgo(-120) },
    ],
    loans: [],
    coach: [],
    kycStatus: 'verified',
  }
}

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw) as Db
  } catch {
    /* ignore */
  }
  const db = seedDb()
  saveDb(db)
  return db
}

function saveDb(db: Db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db))
}

function userFromToken(token: string | null) {
  if (token === 'token-demo') return DEMO
  if (token === 'token-admin') return ADMIN
  return null
}

function requireUser(token: string | null) {
  const user = userFromToken(token)
  if (!user) throw new MockHttpError(401, 'Unauthorized')
  return user
}

function monthlyInsights(db: Db) {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const spendByCat: Record<string, number> = {}
  for (const t of db.transactions) {
    const d = new Date(t.date)
    if (d < start || d >= end || t.amount >= 0) continue
    const cat = t.category || 'Uncategorized'
    spendByCat[cat] = (spendByCat[cat] ?? 0) + Math.abs(t.amount)
  }

  const budgetMap: Record<string, { amount: number; name: string }> = {}
  for (const b of db.budgets) {
    budgetMap[b.category] = { amount: b.amount, name: b.name }
  }

  const byCategory = Object.entries(spendByCat)
    .map(([category, spent]) => ({
      category,
      spent,
      budget: budgetMap[category]?.amount ?? null,
      overBudget: budgetMap[category] ? spent > budgetMap[category].amount : false,
      budgetName: budgetMap[category]?.name ?? null,
    }))
    .sort((a, b) => b.spent - a.spent)

  const monthlyTrend = [2, 1, 0].map((offset) => {
    const d = new Date(year, month - 1 - offset, 1)
    const s = new Date(d.getFullYear(), d.getMonth(), 1)
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    let spent = 0
    let credits = 0
    for (const t of db.transactions) {
      const td = new Date(t.date)
      if (td < s || td >= e) continue
      if (t.amount < 0) spent += Math.abs(t.amount)
      else credits += t.amount
    }
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      spent,
      credits,
    }
  })

  return {
    month,
    year,
    totalSpent: byCategory.reduce((s, c) => s + c.spent, 0),
    totalBudgeted: Object.values(budgetMap).reduce((s, b) => s + b.amount, 0),
    byCategory,
    monthlyTrend,
  }
}

type Body = Record<string, unknown> | undefined

export function handleMockRequest(pathWithQuery: string, method: string, body?: Body, token?: string | null): unknown {
  const [pathname, qs] = pathWithQuery.split('?')
  const params = new URLSearchParams(qs ?? '')
  const verb = method.toUpperCase()

  if (verb === 'POST' && pathname === '/auth/login') {
    const email = String(body?.email ?? '')
      .toLowerCase()
      .trim()
    const password = String(body?.password ?? '')
    const user = [DEMO, ADMIN].find((u) => u.email === email)
    if (!user || user.password !== password) throw new MockHttpError(401, 'Invalid email or password')
    const accessToken = user.role === 'admin' ? 'token-admin' : 'token-demo'
    return { user: publicUser(user), accessToken, token: accessToken, expiresIn: 900 }
  }

  if (verb === 'POST' && pathname === '/auth/verify') {
    throw new MockHttpError(400, 'Wallet sign-in is not available in this take-home.')
  }

  if (verb === 'POST' && pathname === '/auth/nonce') {
    return { nonce: 'unused' }
  }

  const user = requireUser(token ?? null)
  const db = loadDb()

  if (verb === 'GET' && pathname === '/auth/me') return publicUser(user)
  if (verb === 'POST' && pathname === '/auth/logout') return { ok: true }

  if (verb === 'GET' && pathname === '/accounts') return db.accounts
  if (verb === 'GET' && pathname === '/accounts/link/config') {
    return {
      mode: 'demo',
      providerLabel: 'Demo bank link',
      message: 'Pick a sample institution. No real bank connection.',
      institutions: [
        { id: 'demo-credit', name: 'Demo Credit Union', detail: 'Another sample checking account' },
        { id: 'harbor', name: 'Harbor Trust', detail: 'Sample savings account' },
      ],
    }
  }
  if (verb === 'POST' && pathname === '/accounts/link/token') return { linkToken: 'demo-link-token' }
  if (verb === 'POST' && pathname === '/accounts/link') {
    const id = crypto.randomUUID()
    db.accounts.push({
      id,
      institutionName: String(body?.institutionId ?? 'Linked Bank'),
      accountName: 'Checking',
      accountType: 'checking',
      mask: '1001',
      currentBalance: 1000,
      linkedAt: new Date().toISOString(),
      provider: 'demo',
      linkStatus: 'linked',
    })
    saveDb(db)
    return { ok: true }
  }
  const sync = pathname.match(/^\/accounts\/([^/]+)\/sync$/)
  if (verb === 'POST' && sync) return { ok: true }

  if (verb === 'GET' && pathname === '/transactions/categories') {
    return [...new Set(db.transactions.map((t) => t.category).filter(Boolean))].sort()
  }
  if (verb === 'GET' && pathname === '/transactions') {
    let rows = [...db.transactions]
    const category = params.get('category')
    const startDate = params.get('startDate')
    const endDate = params.get('endDate')
    const accountId = params.get('accountId')
    const limit = Math.min(parseInt(params.get('limit') ?? '50', 10) || 50, 200)
    if (accountId) rows = rows.filter((t) => t.accountId === accountId)
    if (category) rows = rows.filter((t) => t.category === category)
    if (startDate) rows = rows.filter((t) => t.date.slice(0, 10) >= startDate)
    if (endDate) rows = rows.filter((t) => t.date.slice(0, 10) <= endDate)
    rows.sort((a, b) => b.date.localeCompare(a.date))
    return rows.slice(0, limit)
  }
  const txPatch = pathname.match(/^\/transactions\/([^/]+)$/)
  if (verb === 'PATCH' && txPatch) {
    const tx = db.transactions.find((t) => t.id === txPatch[1])
    if (!tx) throw new MockHttpError(404, 'Transaction not found')
    if (body?.category !== undefined) tx.category = String(body.category)
    if (body?.subcategory !== undefined) tx.subcategory = String(body.subcategory)
    if (body?.notes !== undefined) tx.notes = String(body.notes)
    saveDb(db)
    return tx
  }

  if (verb === 'GET' && pathname === '/budgets') return db.budgets
  if (verb === 'POST' && pathname === '/budgets') {
    const created: Budget = {
      id: crypto.randomUUID(),
      name: String(body?.name ?? ''),
      category: String(body?.category ?? ''),
      amount: Number(body?.amount ?? 0),
      period: String(body?.period ?? 'monthly'),
      startDate: String(body?.startDate ?? new Date().toISOString()),
      endDate: body?.endDate ? String(body.endDate) : null,
    }
    if (!created.name || !created.category) throw new MockHttpError(400, 'Name and category required')
    db.budgets.unshift(created)
    saveDb(db)
    return created
  }
  const budgetId = pathname.match(/^\/budgets\/([^/]+)$/)
  if (budgetId) {
    const budget = db.budgets.find((b) => b.id === budgetId[1])
    if (!budget) throw new MockHttpError(404, 'Budget not found')
    if (verb === 'GET') return budget
    if (verb === 'PATCH') {
      if (body?.name != null) budget.name = String(body.name)
      if (body?.amount != null) budget.amount = Number(body.amount)
      saveDb(db)
      return budget
    }
    if (verb === 'DELETE') {
      db.budgets = db.budgets.filter((b) => b.id !== budget.id)
      saveDb(db)
      return undefined
    }
  }

  if (verb === 'GET' && pathname === '/insights/monthly') return monthlyInsights(db)

  if (verb === 'GET' && pathname === '/savings') return db.savings
  if (verb === 'POST' && pathname === '/savings') {
    const created: Goal = {
      id: crypto.randomUUID(),
      name: String(body?.name ?? ''),
      targetAmount: Number(body?.targetAmount ?? 0),
      currentAmount: Number(body?.currentAmount ?? 0),
      targetDate: body?.targetDate ? String(body.targetDate) : null,
    }
    db.savings.unshift(created)
    saveDb(db)
    return created
  }
  const goalId = pathname.match(/^\/savings\/([^/]+)$/)
  if (goalId) {
    const goal = db.savings.find((g) => g.id === goalId[1])
    if (!goal) throw new MockHttpError(404, 'Goal not found')
    if (verb === 'PATCH') {
      if (body?.currentAmount != null) goal.currentAmount = Number(body.currentAmount)
      if (body?.name != null) goal.name = String(body.name)
      saveDb(db)
      return goal
    }
    if (verb === 'DELETE') {
      db.savings = db.savings.filter((g) => g.id !== goal.id)
      saveDb(db)
      return undefined
    }
  }

  if (verb === 'GET' && pathname === '/loans/eligibility') {
    return {
      riskScore: 72,
      decision: 'approve',
      reasonCodes: [{ code: 'STABLE_INCOME', description: 'Regular payroll deposits' }],
      recommendedLimit: 5000,
      attestation: null,
    }
  }
  if (verb === 'GET' && pathname === '/loans') return db.loans
  if (verb === 'POST' && pathname === '/loans/apply') {
    const amount = Number(body?.amount ?? 0)
    const termMonths = Number(body?.termMonths ?? 12)
    const created: Loan = {
      id: crypto.randomUUID(),
      amount,
      status: 'pending',
      termMonths,
      monthlyPayment: Math.round((amount / termMonths) * 100) / 100,
      interestRatePct: 8.5,
      appliedAt: new Date().toISOString(),
    }
    db.loans.unshift(created)
    saveDb(db)
    return { message: 'Application submitted', loan: created }
  }

  if (verb === 'GET' && pathname === '/coach/history') return { messages: db.coach }
  if (verb === 'POST' && pathname === '/coach/chat') {
    const message = String(body?.message ?? '')
    db.coach.push({ role: 'user', content: message })
    const reply =
      'This take-home uses a local mock coach. Implement Transactions, Budgets, and Recurring — see ASSIGNMENT.md.'
    db.coach.push({ role: 'assistant', content: reply })
    saveDb(db)
    return { message: reply }
  }
  if (verb === 'DELETE' && pathname === '/coach/history') {
    db.coach = []
    saveDb(db)
    return { ok: true }
  }

  if (verb === 'GET' && pathname === '/kyc/me') return { status: db.kycStatus }
  if (verb === 'POST' && pathname === '/kyc/submit') {
    db.kycStatus = 'verified'
    saveDb(db)
    return { status: 'verified', message: 'Identity recorded (demo).' }
  }
  if (verb === 'GET' && pathname === '/kyc/admin') return []

  if (verb === 'GET' && pathname === '/blockchain/me') {
    return {
      mode: 'off',
      enabled: false,
      chainId: 0,
      loanContract: null,
      attestationContract: null,
      walletAddress: user.walletAddress,
      onChainLoans: [],
      trustAttestations: [],
    }
  }

  if (pathname.startsWith('/admin')) {
    if (user.role !== 'admin') throw new MockHttpError(403, 'Admin access required')
    return []
  }

  throw new MockHttpError(404, `No mock for ${verb} ${pathname}`)
}
