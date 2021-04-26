import React, { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  categoryTitle: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

interface OrderBy {
  attribute: 'title' | 'value' | 'categoryTitle' | 'created_at';
  order: 'asc' | 'desc';
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [orderBy, setOrderBy] = useState<OrderBy>({
    attribute: 'created_at',
    order: 'asc',
  });

  function handleOrderBy({ attribute }: Omit<OrderBy, 'order'>): void {
    setOrderBy({
      attribute,
      order: orderBy.order === 'asc' ? 'desc' : 'asc',
    });
  }

  useEffect(() => {
    const { attribute, order } = orderBy;
    const data = [...transactions];

    if (order === 'asc') {
      data.sort((a, b) =>
        a[attribute] < b[attribute] ? -1 : a[attribute] > b[attribute] ? 1 : 0,
      );
    } else {
      data.sort((a, b) =>
        a[attribute] > b[attribute] ? -1 : a[attribute] < b[attribute] ? 1 : 0,
      );
    }

    setTransactions(data);
  }, [orderBy]);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<Response>('transactions');

      const transactionsFormatted = data.transactions.map(transaction => ({
        ...transaction,
        formattedValue:
          transaction.type === 'outcome'
            ? `- ${formatValue(Number(transaction.value))}`
            : formatValue(Number(transaction.value)),
        formattedDate: formatDate(new Date(transaction.created_at)),
        categoryTitle: transaction.category.title,
      }));

      setTransactions(transactionsFormatted);
      setBalance({
        income: formatValue(Number(data.balance.income)),
        outcome: formatValue(Number(data.balance.outcome)),
        total: formatValue(Number(data.balance.total)),
      });
      setOrderBy({
        attribute: 'created_at',
        order: 'asc',
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    onClick={() => handleOrderBy({ attribute: 'title' })}
                  >
                    Título
                    {orderBy.order === 'desc' &&
                    orderBy.attribute === 'title' ? (
                      <FiChevronUp size={20} color="#ff872c" />
                    ) : (
                      <FiChevronDown
                        size={20}
                        color={
                          orderBy.attribute === 'title' ? '#ff872c' : '#969cb3'
                        }
                      />
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => handleOrderBy({ attribute: 'value' })}
                  >
                    Preço
                    {orderBy.order === 'desc' &&
                    orderBy.attribute === 'value' ? (
                      <FiChevronUp size={20} color="#ff872c" />
                    ) : (
                      <FiChevronDown
                        size={20}
                        color={
                          orderBy.attribute === 'value' ? '#ff872c' : '#969cb3'
                        }
                      />
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() =>
                      handleOrderBy({ attribute: 'categoryTitle' })}
                  >
                    Categoria
                    {orderBy.order === 'desc' &&
                    orderBy.attribute === 'categoryTitle' ? (
                      <FiChevronUp size={20} color="#ff872c" />
                    ) : (
                      <FiChevronDown
                        size={20}
                        color={
                          orderBy.attribute === 'categoryTitle'
                            ? '#ff872c'
                            : '#969cb3'
                        }
                      />
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => handleOrderBy({ attribute: 'created_at' })}
                  >
                    Data
                    {orderBy.order === 'desc' &&
                    orderBy.attribute === 'created_at' ? (
                      <FiChevronUp size={20} color="#ff872c" />
                    ) : (
                      <FiChevronDown
                        size={20}
                        color={
                          orderBy.attribute === 'created_at'
                            ? '#ff872c'
                            : '#969cb3'
                        }
                      />
                    )}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
