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
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'hsl(142, 70%, 45%)',
        color: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
      }}
      aria-label="Chat on WhatsApp"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <MessageCircle size={26} />
    </a>,
    document.body
  );
};

export default WhatsAppButton;
