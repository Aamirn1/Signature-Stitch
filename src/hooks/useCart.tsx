import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CartNotification from "@/components/CartNotification";

export type CartItemCustomization = Record<string, string>;

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  measurementId?: string;
  measurementLabel?: string;
  customization?: CartItemCustomization;
  extraCharges?: number;
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

const CART_STORAGE_KEY = "ss_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const getCartKey = (item: { id: string; measurementId?: string; customization?: CartItemCustomization }) => {
    const custKey = item.customization
      ? `${item.customization.clothType}-${item.customization.collarType}-${item.customization.buttonType}-${item.customization.flareType}-${item.customization.pleatType}`
      : "default";
    return `${item.id}-${item.measurementId || ""}-${custKey}`;
  };

  const addItem = (item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const newKey = getCartKey(item);
      const existing = prev.find((i) => getCartKey(i) === newKey);
      if (existing) {
        return prev.map((i) =>
          getCartKey(i) === newKey
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    toast.custom(() => <CartNotification productName={item.name} />, {
      duration: 2500,
      style: {
        background: "hsl(0 0% 8%)",
        border: "1px solid hsl(45 93% 47% / 0.3)",
        borderRadius: "12px",
        boxShadow: "0 0 30px hsl(45 93% 47% / 0.15), 0 10px 40px -10px hsl(0 0% 0% / 0.5)",
        padding: "12px 16px",
      },
    });
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
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

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
