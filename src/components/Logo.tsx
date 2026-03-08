import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl lg:text-2xl",
    lg: "text-2xl lg:text-3xl",
  };

  return (
    <Link to="/" className={`flex items-center gap-1 group ${className}`}>
      <span className={`font-heading font-bold tracking-wider ${sizeClasses[size]} logo-shimmer`}>
        <span className="relative inline-block text-gold-gradient">
          {/* Crown on first S */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.5em] rotate-[-15deg] opacity-90">👑</span>
          S
        </span>
        <span className="text-foreground">ignature </span>
        <span className="text-gold-gradient">S</span>
        <span className="text-foreground">titch</span>
      </span>
    </Link>
  );
};

export default Logo;
