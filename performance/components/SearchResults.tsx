import { List, ListRowRenderer } from 'react-virtualized';

import { useMemo } from 'react';

import { ProductItem } from "./ProductItem";

interface Props {
  results: Array<{
    id: number;
    price: number;
    title: string
  }>;
  onAddToWishList(id: number): void;
}

export const SearchResults = (props: Props) => {
  const { results, onAddToWishList } = props

  /**
   * 1. Usado para operações pesadas (cálculos complexos)
   * 2. Igualdade referencial (quando a gente repassa a informação para um componente filho)
   */
  const totalPrice =  useMemo(() => {
    return results.reduce((acc, curr) => {
      return acc + curr.price
    }, 0);
  }, [results]);

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
      <ProductItem
        key={key}
        product={results[index]}
        onAddToWishList={onAddToWishList}
      />
    </div>
    )
  }

  return (
    <div>
      <h2>{totalPrice}</h2>

      {/* {results.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onAddToWishList={onAddToWishList}
        />
      ))} */}

      <List
        height={300}
        rowHeight={30}
        width={900}
        overscanRowCount={5}
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />
    </div>
  )
};
