export interface AddProductToWishListProps {
  onAddToWishList(): void;
  onRequestClose(): void;
}

export const AddProductToWishList = (props: AddProductToWishListProps) => {
  const { onAddToWishList, onRequestClose } = props;

  return (
    <span>
      Deseja adicionar aos favoritos?

      <button onClick={onAddToWishList}>Sim</button>
      <button onClick={onRequestClose}>Não</button>
    </span>
  )
}