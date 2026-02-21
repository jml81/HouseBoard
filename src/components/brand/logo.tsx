import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'plus';
  size?: 'sm' | 'md' | 'lg';
}

// Default (horizontal) has wide aspect ratio; plus (stacked) needs taller sizes
const defaultSizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
} as const;

const plusSizeClasses = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
} as const;

export function Logo({
  className,
  variant = 'default',
  size = 'md',
}: LogoProps): React.JSX.Element {
  const sizeClasses = variant === 'plus' ? plusSizeClasses : defaultSizeClasses;

  if (variant === 'plus') {
    return <PlusLogo className={cn(sizeClasses[size], 'w-auto', className)} />;
  }
  return <DefaultLogo className={cn(sizeClasses[size], 'w-auto', className)} />;
}

/* ------------------------------------------------------------------ */
/* HouseBoard — horizontal: "House" [buildings] "Board"               */
/* Buildings have perspective angle (tops slant upward to the right)  */
/* ------------------------------------------------------------------ */
function DefaultLogo({ className }: { className: string }): React.JSX.Element {
  const gold = '#D4A843';

  return (
    <svg
      viewBox="0 0 240 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HouseBoard"
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

      {/* Perspective buildings — angled tops like the original design */}
      <g transform="translate(90, 0)">
        {/* Left building */}
        <polygon points="0,36 0,20 9,16 9,36" fill={gold} />
        <rect x="2" y="22" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="5.5" y="20.5" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="2" y="26" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="5.5" y="24.5" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="2" y="30" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="5.5" y="28.5" width="1.8" height="2" rx="0.3" fill="white" />

        {/* Center building (tallest) */}
        <polygon points="11,36 11,12 22,7 22,36" fill={gold} />
        <rect x="13" y="14" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="17.5" y="12" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="13" y="18.5" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="17.5" y="16.5" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="13" y="23" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="17.5" y="21" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="13" y="27.5" width="2" height="2.2" rx="0.3" fill="white" />
        <rect x="17.5" y="25.5" width="2" height="2.2" rx="0.3" fill="white" />

        {/* Right building */}
        <polygon points="24,36 24,16 34,12 34,36" fill={gold} opacity="0.85" />
        <rect x="26" y="18" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="29.5" y="16.5" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="26" y="22" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="29.5" y="20.5" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="26" y="26" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="29.5" y="24.5" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="26" y="30" width="1.8" height="2" rx="0.3" fill="white" />
        <rect x="29.5" y="28.5" width="1.8" height="2" rx="0.3" fill="white" />
      </g>

      {/* "Board" text */}
      <text
        x="132"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="300"
        fill="#3D3D3D"
        letterSpacing="-0.5"
      >
        Board
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* HouseBoard+ — stacked: buildings on top, "HouseBoard+" text below  */
/* Green buildings with perspective, matching the original design      */
/* ------------------------------------------------------------------ */
function PlusLogo({ className }: { className: string }): React.JSX.Element {
  const green = '#2E7D32';
  const greenLight = '#388E3C';

  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HouseBoard+"
      role="img"
    >
      {/* Buildings — stacked above text, perspective angle */}
      <g transform="translate(55, 0)">
        {/* Left building */}
        <polygon points="0,62 0,32 26,24 26,62" fill={green} />
        <rect x="4" y="34" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="14" y="31" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="4" y="42" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="14" y="39" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="4" y="50" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="14" y="47" width="5" height="4.5" rx="0.5" fill="white" opacity="0.9" />

        {/* Center building (tallest) */}
        <polygon points="30,62 30,18 62,6 62,62" fill={green} />
        <rect x="34.5" y="22" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="48" y="17" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="34.5" y="30" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="48" y="25" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="34.5" y="38" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="48" y="33" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="34.5" y="46" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="48" y="41" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="34.5" y="54" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="48" y="49" width="6" height="5" rx="0.5" fill="white" opacity="0.9" />

        {/* Right building */}
        <polygon points="66,62 66,26 94,16 94,62" fill={greenLight} />
        <rect x="70.5" y="30" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="82" y="25.5" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="70.5" y="38" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="82" y="33.5" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="70.5" y="46" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="82" y="41.5" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="70.5" y="54" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="82" y="49.5" width="5.5" height="4.5" rx="0.5" fill="white" opacity="0.9" />
      </g>

      {/* "HouseBoard+" text — centered below buildings */}
      <text
        x="120"
        y="88"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="300"
        fill="#3D3D3D"
        letterSpacing="-0.5"
      >
        HouseBoard
      </text>
      <text
        x="198"
        y="88"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="#2E7D32"
      >
        +
      </text>
    </svg>
  );
}
