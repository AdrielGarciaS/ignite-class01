import { useTransactions } from "hooks/TransactionsContext"
import { Container } from "./styles"

export const TransactionsTable = () => {
  const transactions = useTransactions()

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
                {transaction.formattedAmount}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.formattedCreatedAt}</td>
            </tr>
          ))}          
        </tbody>
      </table>
    </Container>
  )
}