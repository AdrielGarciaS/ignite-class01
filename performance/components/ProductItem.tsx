interface Props {
  product: { 
    id: number;
    price: number;
    title: string 
  }
}

export const ProductItem = (props: Props) => {
  const { product } = props;

  return (
    <div>
      {product.title} - <strong>{product.price}</strong>
    </div>
  );
}
