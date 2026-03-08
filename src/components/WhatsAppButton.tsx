import { createPortal } from "react-dom";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return createPortal(
    <a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_hsl(142_70%_45%/0.4)] hover:scale-110 active:scale-95 transition-all duration-300 pulse-ring text-foreground animate-[scale-in_0.5s_ease-out_2s_both]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>,
    document.body
  );
};

export default WhatsAppButton;
