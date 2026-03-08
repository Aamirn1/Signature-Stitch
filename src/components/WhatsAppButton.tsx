import { createPortal } from "react-dom";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return createPortal(
    <a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[10.5rem] right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 pulse-ring"
      style={{
        backgroundColor: 'hsl(142, 70%, 45%)',
        color: 'white',
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>,
    document.body
  );
};

export default WhatsAppButton;
