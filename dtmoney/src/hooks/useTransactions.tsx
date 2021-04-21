import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { formatAmount, formatDate } from 'helpers/format'
import { api } from 'services/api'

interface Transaction {
  id: number
  title: string
  type: 'deposit' | 'withdraw'
  amount: number
  category: string
  createdAt: string
}

interface TransactionFormatted extends Transaction {
  formattedAmount: string
  formattedCreatedAt: string

}

type CreateTransactionParams = Pick<Transaction, 'title' | 'type' | 'amount' | 'category'>

interface useTransactionsData {
  transactions: TransactionFormatted[]
  createTransaction(transaction: CreateTransactionParams): Promise<void>
}

export const TransactionsContext = createContext({} as useTransactionsData)

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

      setTransactions(transactionsData)
    })
  }, [])

  const formattedTransactions = useMemo<TransactionFormatted[]>(() => 
     transactions.map(transaction => ({
      ...transaction,
      formattedAmount: formatAmount(transaction.amount),
      formattedCreatedAt: transaction.createdAt ? formatDate(transaction.createdAt) : ''
    }))
  , [transactions])

  async function createTransaction(data: CreateTransactionParams) {
    const response = await api.post<{ transaction: Transaction }>(
      '/transactions', 
      {
        ...data,
        createdAt: new Date()
      }
    )

    const { transaction } = response.data

    setTransactions([...transactions, transaction])
  }

  return (
    <TransactionsContext.Provider 
    value={{ 
      transactions: formattedTransactions, 
      createTransaction 
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  return useContext(TransactionsContext)
}