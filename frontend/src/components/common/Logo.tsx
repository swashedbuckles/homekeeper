import { Link } from 'react-router';

export interface LogoProps {
    className?: string; // Make optional since you have default
    size?: number;
    color?: 'primary' | 'secondary' | 'accent';
    border?: 'light' | 'dark';
    shadow?: 'primary' | 'secondary' | 'accent';
  }

  /**
   * Logo component that renders the HomeKeeper logo with container
   * @param size - The size of the logo in pixels (default: 48)
   * @param className - Additional CSS classes to apply to the container
   * @param color - Background color variant (default: 'primary')
   * @param border - Border color variant (default: 'light')
   * @param shadow - Shadow color variant (default: 'primary')
   * @returns JSX element containing the HomeKeeper logo with styled container
   * @example
   * <Logo size={64} color="secondary" border="dark" shadow="accent" />
   */
  export const Logo = ({
    size = 48,
    className = '',
    color = 'primary',
    border = 'light',
    shadow = 'primary',
  }: LogoProps) => {
    const borderColor = border === 'light' ? 'border-white' : 'border-text-primary';
    const shadowClass = `brutal-shadow-${shadow}`;
    const backgroundClass = `bg-${color}`;

    const containerClass = [
      'border-2 lg:border-4',
      'w-12 h-12 lg:w-16 lg:h-16',
      'brutal-rotate-left flex items-center justify-center',
      borderColor,
      shadowClass,
      backgroundClass,
      className
    ].join(' ');

    return (
      <div className={containerClass}>
        <svg width={size} height={size} viewBox="0 0 128 128">
          <polygon points="20,70 60,35 100,70" fill="white" />
          <line x1="21" y1="70" x2="99" y2="70" stroke="white" strokeWidth="1" />
          <rect x="20" y="70" width="80" height="36" fill="white" />
          <rect x="76" y="40" width="18" height="26" fill="white" />
          <rect x="60" y="74" width="36" height="28" fill="var(--color-primary)" />
          <line x1="64" y1="80" x2="90" y2="80" stroke="white" strokeWidth="2" />
          <line x1="64" y1="85" x2="87" y2="85" stroke="white" strokeWidth="2" />
          <line x1="64" y1="90" x2="90" y2="90" stroke="white" strokeWidth="2" />
          <line x1="64" y1="95" x2="82" y2="95" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    );
  };

/**
 * LogoAndName component that renders the HomeKeeper logo with the brand name
 * @param variant - The visual variant of the logo and name (default: 'dark')
 * @returns JSX element containing the logo and brand name
 * @example
 * <LogoAndName variant="light" />
 */
export function LogoAndName({ variant = 'dark' }: { variant?: 'light' | 'dark' }) {
  const titleClass = variant === 'dark' ? 'text-white brutal-text-shadow' : 'text-primary';
  const shadow = variant === 'dark' ? 'secondary' : 'primary';
  const border = variant === 'dark' ? 'light' : 'dark';
  
  return (
    <div className="flex items-center gap-4">
      <Logo size={64} border={border} shadow={shadow} />
      <Link to="/" className={`${titleClass} font-black text-3xl lg:text-5xl uppercase tracking-tight`}>
        HomeKeeper
      </Link>
    </div>
  );
}

/**
 * HeaderLogo component that renders the logo and name in light variant for use in headers
 * @returns JSX element containing the logo and name in light variant
 */
export function HeaderLogo() {
  return (<LogoAndName variant="light" />);
}


/**
 * FooterLogo component that renders the logo and name in dark variant for use in footers
 * @returns JSX element containing the logo and name in dark variant
 */
export function FooterLogo() {
  return (<LogoAndName variant="dark" />);
}