import { createPortal } from "react-dom";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return createPortal(
    <a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'hsl(142, 70%, 45%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        color: 'white',
        textDecoration: 'none',
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>,
    document.body
  );
};

export default WhatsAppButton;
