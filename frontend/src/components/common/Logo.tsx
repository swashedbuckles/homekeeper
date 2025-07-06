import { Link } from 'react-router';

export const Logo = ({ 
  size = 48, 
  className = 'text-text-primary',
  documentColor = '#e67e22'
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 128 128" 
    className={className}
  >
    <polygon points="20,70 60,35 100,70" fill="currentColor" data-note="roof"/>
    <line x1="21" y1="70" x2="99" y2="70" stroke="currentColor" strokeWidth="1"/>
    <rect x="20" y="70" width="80" height="36" fill="currentColor" data-note="house"/>
    <rect x="76" y="40" width="18" height="26" fill="currentColor" data-note="chimney"/>
    <rect x="60" y="74" width="36" height="28" fill={documentColor} data-note="doc"/>
    <line x1="64" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="2"/>
    <line x1="64" y1="85" x2="87" y2="85" stroke="currentColor" strokeWidth="2"/>
    <line x1="64" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2"/>
    <line x1="64" y1="95" x2="82" y2="95" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export function LogoAndName({variant = 'dark'}: {variant?: 'light' | 'dark'}) {
  const titleClass = variant === 'dark' ? 'text-white brutal-text-shadow' : 'text-primary';
  const iconContainerClass = variant === 'dark' ? 'border-white brutal-shadow-secondary' : 'border-text-primary brutal-shadow-primary';

  return (
    <div className="flex items-center gap-4">
      <div className={`${iconContainerClass} bg-primary border-2 w-12 h-12 lg:w-16 lg:h-16 lg:border-4 brutal-rotate-left flex items-center justify-center`}>
        <Logo size={64} className="text-white" />
      </div>
      <Link to="/" className={`${titleClass} font-black text-3xl lg:text-5xl uppercase tracking-tight`}>
        HomeKeeper
      </Link>
    </div>
  );
}

export function HeaderLogo() {
  return ( <LogoAndName variant="light" />);
}


export function FooterLogo() {
  return ( <LogoAndName variant="dark" />);
}