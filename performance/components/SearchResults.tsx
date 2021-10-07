import { ProductItem } from "./ProductItem";

interface Props {
  results: Array<{ id: number, price: number, title: string }>
}

export const SearchResults = (props: Props) => {
  const { results } = props

  return (
    <div>
      {results.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
};
