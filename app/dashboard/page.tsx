'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpCircle, ArrowDownCircle, RepeatIcon } from 'lucide-react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import type { Transaction, FinancialSummary } from '@/types/finance'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Sample data - replace with actual data from your API
const sampleData: FinancialSummary = {
  totalIncome: 5000,
  totalExpenses: 3500,
  balance: 1500,
  expensesByCategory: {
    'Housing': 1200,
    'Food': 600,
    'Transportation': 400,
    'Entertainment': 300,
    'Utilities': 500,
    'Other': 500
  },
  recurringExpenses: [
    {
      date: '2024-01-01',
      description: 'Rent',
      amount: 1200,
      category: 'Housing',
      isRecurring: true,
      type: 'expense'
    },
    // Add more recurring expenses as needed
  ]
}

export default function Dashboard() {
  const [data, setData] = useState<FinancialSummary>(sampleData)

  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        const response = await fetch('/api/financial-data')
        if (!response.ok) {
          throw new Error('Failed to fetch financial data')
        }
        const financialData = await response.json()
        setData(financialData)
      } catch (error) {
        console.error('Error loading financial data:', error)
        // Keep using sample data as fallback
      }
    }

    loadFinancialData()
  }, [])

  const expenseChartData = {
    labels: Object.keys(data.expensesByCategory),
    datasets: [
      {
        data: Object.values(data.expensesByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: 'rgba(0, 0, 0, 0)',
      },
    ],
  }

  const incomeVsExpenseData = {
    labels: ['Income vs Expenses'],
    datasets: [
      {
        label: 'Income',
        data: [data.totalIncome],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Expenses',
        data: [data.totalExpenses],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="text-emerald-500" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${data.totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="text-red-500" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${data.totalExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RepeatIcon className="text-blue-500" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${data.balance.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar
                    data={incomeVsExpenseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                          },
                          ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                        x: {
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                          },
                          ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Doughnut
                    data={expenseChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Recurring Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recurringExpenses.map((expense, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-zinc-800"
                    >
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-400">{expense.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${expense.amount}</p>
                        <p className="text-sm text-gray-400">Monthly</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

