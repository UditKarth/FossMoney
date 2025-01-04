export interface Transaction {
    date: string
    description: string
    amount: number
    category: string
    isRecurring: boolean
    type: 'income' | 'expense'
  }
  
  export interface FinancialSummary {
    totalIncome: number
    totalExpenses: number
    balance: number
    expensesByCategory: Record<string, number>
    recurringExpenses: Transaction[]
  }
  
  