import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  measurementId?: string;
  measurementLabel?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string, measurementId?: string) => void;
  updateQuantity: (id: string, measurementId: string | undefined, delta: number) => void;
  toggleCart: () => void;
  isOpen: boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.measurementId === item.measurementId);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.measurementId === item.measurementId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, measurementId: string | undefined, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.measurementId === measurementId
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id: string, measurementId?: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.measurementId === measurementId)));
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, toggleCart, isOpen, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
