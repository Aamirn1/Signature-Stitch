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
      <span className={`font-heading font-bold tracking-wider ${sizeClasses[size]} logo-shimmer logo-gold-text`}>
        <span className="relative inline-block">
          {/* Crown on first S - rotated like reference */}
          <svg
            className="absolute -top-[0.72em] left-[0.14em] -rotate-[18deg]"
            width="0.66em"
            height="0.66em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 17L5.5 8L9 13L12 5L15 13L18.5 8L21 17H3Z"
              fill="url(#crownGradient)"
              stroke="hsl(38, 50%, 35%)"
              strokeWidth="0.5"
            />
            <circle cx="12" cy="5" r="1" fill="url(#crownGradient)" />
            <circle cx="9" cy="7.5" r="0.7" fill="url(#crownGradient)" />
            <circle cx="15" cy="7.5" r="0.7" fill="url(#crownGradient)" />
            <defs>
              <linearGradient id="crownGradient" x1="3" y1="5" x2="21" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(38, 80%, 65%)" />
                <stop offset="0.5" stopColor="hsl(38, 70%, 50%)" />
                <stop offset="1" stopColor="hsl(38, 55%, 38%)" />
              </linearGradient>
            </defs>
          </svg>
          S
        </span>
        ignature{" "}
        Stitch
      </span>
    </Link>
  );
};

export default Logo;
