import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_hsl(142_70%_45%/0.4)] transition-shadow text-foreground"
      aria-label="Chat on WhatsApp"
      style={{ position: 'fixed', bottom: '24px', right: '24px' }}
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default WhatsAppButton;
