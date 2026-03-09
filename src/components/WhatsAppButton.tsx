import { createPortal } from "react-dom";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const WhatsAppButton = () => {
  const { isOpen } = useCart();
  const { pathname } = useLocation();

  if (isOpen || pathname === "/checkout") return null;

  return createPortal(
    <a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[hsl(142,70%,45%)] text-white shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
    </a>,
    document.body
  );
};

export default WhatsAppButton;
