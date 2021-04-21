import incomeImg from 'assets/income.svg'
import outcomeImg from 'assets/outcome.svg'
import totalImg from 'assets/total.svg'
import { formatAmount } from 'helpers/format'
import { useTransactions } from 'hooks/useTransactions'

import { Container } from "./styles"

interface SummaryTotals {
  totalDeposits: number
  totalWithdraws: number
  balance: number
}

export const Summary = () => {
  const { transactions } = useTransactions()

  const { totalDeposits, totalWithdraws, balance } = transactions
    .reduce((acc, transaction) => {
      if (transaction.type === 'withdraw') {
        const totalWithdraws = acc.totalWithdraws + transaction.amount
        const balance = acc.balance - transaction.amount

        return { ...acc, totalWithdraws, balance }
      }

      const totalDeposits = acc.totalDeposits + transaction.amount
      const balance = acc.balance + transaction.amount

      return { ...acc, totalDeposits, balance }
    }, { totalDeposits: 0, totalWithdraws: 0, balance: 0 } as SummaryTotals)

  const formattedDeposits = formatAmount(totalDeposits)
  const formattedWithdraws = formatAmount(totalWithdraws)
  const formattedBalance = formatAmount(balance)

  console.log(balance)

  return (
    <Container>
      <div>
        <header>
          <p>Entradas</p>
          <img src={incomeImg} alt="Entradas"/>
        </header>
        <strong>{formattedDeposits}</strong>
      </div>
      
      <div>
        <header>
          <p>Saídas</p>
          <img src={outcomeImg} alt="Saídas"/>
        </header>
        <strong>- {formattedWithdraws}</strong>
      </div>

      <div className="highlight-background">
        <header>
          <p>Total</p>
          <img src={totalImg} alt="Total"/>
        </header>
        <strong>{formattedBalance}</strong>
      </div>
    </Container>
  )
}