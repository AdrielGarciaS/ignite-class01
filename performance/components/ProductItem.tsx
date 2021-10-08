import { memo } from 'react';

interface Props {
  product: { 
    id: number;
    price: number;
    title: string;
  };
  onAddToWishList(id: number): void;
}

const ProductItemComponent = (props: Props) => {
  const { product, onAddToWishList } = props;

  return (
    <div>
      {product.title} - <strong>{product.price}</strong>
      <button onClick={() => onAddToWishList(product.id)}>
        Add to wishlist
      </button>
    </div>
  );
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.product, nextProps.product);
});
