import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from 'services/api'

export const TransactionsContext = createContext([] as Transaction[])

function formatAmount(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

interface Transaction {
  id: number
  title: string
  type: string
  amount: number
  formattedAmount: string
  category: string
  createdAt: string
  formattedCreatedAt: string
}

interface Props {
  children: ReactNode
}

export function TransactionsProvider(props: Props) {
  const { children } = props

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions')
    .then(response => {
      const { transactions: transactionsData } = response.data

      const _transactions = transactionsData.map((transaction: any) => ({
        ...transaction,
        formattedAmount: formatAmount(transaction.amount),
        formattedCreatedAt: formatDate(transaction.createdAt)
      }))

      setTransactions(_transactions)
    })
  }, [])

  return (
    <TransactionsContext.Provider value={transactions}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  return useContext(TransactionsContext)
}