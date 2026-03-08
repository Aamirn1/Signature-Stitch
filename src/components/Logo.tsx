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
      <span className={`font-heading font-bold tracking-wider ${sizeClasses[size]} logo-shimmer text-gold-gradient`}>
        <span className="relative inline-block">
          {/* SVG Crown on first S */}
          <svg
            className="absolute -top-[0.6em] left-1/2 -translate-x-1/2 rotate-[-15deg]"
            width="0.7em"
            height="0.7em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 18L4.5 7L8.5 12L12 4L15.5 12L19.5 7L22 18H2Z"
              fill="url(#crownGold)"
              stroke="hsl(38, 50%, 40%)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient id="crownGold" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(38, 70%, 70%)" />
                <stop offset="0.5" stopColor="hsl(38, 60%, 55%)" />
                <stop offset="1" stopColor="hsl(38, 50%, 40%)" />
              </linearGradient>
            </defs>
          </svg>
          S
        </span>
        ignature{" "}
        <span className="inline-block">S</span>
        titch
      </span>
    </Link>
  );
};

export default Logo;
