import { useEffect, useState } from "react"

import { api } from "services/api"
import { Container } from "./styles"

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
  amount: string
  category: string
  createdAt: string
}

export const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions')
    .then(response => {
      const { transactions: transactionsData } = response.data

      const _transactions = transactionsData.map((transaction: any) => ({
        ...transaction,
        amount: formatAmount(transaction.amount),
        createdAt: formatDate(transaction.createdAt)
      }))

      setTransactions(_transactions)
    })
  }, [])

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>
                {transaction.amount}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.createdAt}</td>
            </tr>
          ))}          
        </tbody>
      </table>
    </Container>
  )
}