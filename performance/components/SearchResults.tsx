import { useMemo } from 'react';

import { ProductItem } from "./ProductItem";

interface Props {
  results: Array<{ id: number, price: number, title: string }>
}

export const SearchResults = (props: Props) => {
  const { results } = props

  /**
   * 1. Usado para operações pesadas (cálculos complexos)
   * 2. Igualdade referencial (quando a gente repassa a informação para um componente filho)
   */
  const totalPrice =  useMemo(() => {
    return results.reduce((acc, curr) => {
      return acc + curr.price
    }, 0);
  }, [results]);

  return (
    <div>
      <h2>{totalPrice}</h2>

      {results.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
};
