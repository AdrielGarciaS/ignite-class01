import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const cartStorageKey = '@RocketShoes:cart'

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(cartStorageKey)

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const updateCart = (_cart: Product[]) => {
    setCart(_cart)
    localStorage.setItem(cartStorageKey, JSON.stringify(_cart))
  }

  const addProduct = async (productId: number) => {
    try {
      const stockResponse = await api.get<Stock>(`stock/${productId}`)

      const { amount } = stockResponse.data

      if (amount < 2) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      const { data: productData } = await api.get(`products/${productId}`)

      const findProduct = cart.find(product => product.id === productId)

      if (findProduct) {
        const _cart = cart.map(product => product.id === productId 
          ? { ...productData, amount: product.amount + 1 }
          : product
        )

        updateCart(_cart)
        return
      }

      const _cart = [...cart, { ...productData, amount: 1 }]
      updateCart(_cart)
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    const _cart = cart.filter(product => product.id !== productId)

    if (_cart.length === cart.length) {
      toast.error('Erro na remoção do produto')
      return
    }

    updateCart(_cart)
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount < 1) return

      const stockResponse = await api.get<Stock>(`stock/${productId}`)

      const { amount: stockAmount } = stockResponse.data

      if (stockAmount < amount) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      const _cart = cart.map(product => product.id === productId
        ? { ...product, amount }
        : product
      )

      updateCart(_cart)
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
