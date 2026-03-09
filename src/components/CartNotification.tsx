import { ShoppingBag, Check } from "lucide-react";

interface CartNotificationProps {
  productName: string;
}

const CartNotification = ({ productName }: CartNotificationProps) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
      <Check size={14} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground truncate">{productName}</p>
      <p className="text-xs text-muted-foreground">Added to cart</p>
    </div>
    <ShoppingBag size={16} className="text-primary shrink-0" />
  </div>
);

export default CartNotification;
