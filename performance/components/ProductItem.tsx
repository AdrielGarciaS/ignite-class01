import { memo } from 'react';

interface Props {
  product: { 
    id: number;
    price: number;
    title: string 
  }
}

const ProductItemComponent = (props: Props) => {
  const { product } = props;

  return (
    <div>
      {product.title} - <strong>{product.price}</strong>
    </div>
  );
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.product, nextProps.product);
});
