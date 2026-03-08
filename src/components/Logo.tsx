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
    <Link to="/" className={`flex items-center gap-1 group relative ${className}`}>
      <span
        className={`font-heading font-bold tracking-wider ${sizeClasses[size]} logo-shimmer logo-gold-text`}
        style={{ textShadow: "0 0 40px hsl(45 93% 47% / 0.5)" }}
      >
        Signature Stitch
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
};

export default Logo;
