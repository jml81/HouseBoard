import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'plus';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
} as const;

export function Logo({
  className,
  variant = 'default',
  size = 'md',
}: LogoProps): React.JSX.Element {
  const accentColor = variant === 'plus' ? '#2E7D32' : '#D4A843';

  return (
    <svg
      viewBox="0 0 240 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], 'w-auto', className)}
      aria-label={variant === 'plus' ? 'HouseBoard+' : 'HouseBoard'}
      role="img"
    >
      {/* "House" text */}
      <text
        x="0"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="300"
        fill="#3D3D3D"
        letterSpacing="-0.5"
      >
        House
      </text>

      {/* Building icons */}
      <g transform="translate(90, 4)">
        {/* Left building */}
        <rect x="0" y="12" width="8" height="24" rx="1" fill={accentColor} />
        <rect x="2" y="15" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="4.5" y="15" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="2" y="19" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="4.5" y="19" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="2" y="23" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="4.5" y="23" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="2" y="27" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="4.5" y="27" width="1.5" height="2" rx="0.3" fill="white" />

        {/* Center building (tallest) */}
        <rect x="10" y="4" width="10" height="32" rx="1" fill={accentColor} />
        <rect x="12" y="7" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="7" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="12" y="11" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="11" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="12" y="15" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="15" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="12" y="19" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="19" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="12" y="23" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="23" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="12" y="27" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="15.2" y="27" width="1.8" height="2" rx="0.3" fill="white" />

        {/* Right building */}
        <rect x="22" y="8" width="9" height="28" rx="1" fill={accentColor} opacity="0.8" />
        <rect x="24" y="11" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="27" y="11" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="24" y="15" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="27" y="15" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="24" y="19" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="27" y="19" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="24" y="23" width="1.5" height="2" rx="0.3" fill="white" />
        <rect x="27" y="23" width="1.5" height="2" rx="0.3" fill="white" />
      </g>

      {/* "Board" text */}
      <text
        x="135"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="300"
        fill="#3D3D3D"
        letterSpacing="-0.5"
      >
        Board
      </text>

      {/* "+" for plus variant */}
      {variant === 'plus' && (
        <text
          x="210"
          y="30"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="28"
          fontWeight="600"
          fill="#2E7D32"
        >
          +
        </text>
      )}
    </svg>
  );
}
