import { useLocation } from 'react-router';

export function AppNavigation() {
  const location = useLocation();

  const activeClasses = [
    'bg-transparent',
    'text-primary',
    'border-0',
    'border-b-4',
    'border-b-primary',
    'font-black',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
  ].join(' ');

  const inactiveClasses = [
    'bg-transparent',
    'text-text-secondary',
    'border-0',
    'border-b-4',
    'border-b-transparent',
    'font-bold',
    'uppercase',
    'tracking-wider',
    'px-6',
    'py-3',
    'brutal-transition',
    'hover:text-primary',
    'hover:border-b-primary/30'
  ].join(' ');

  const locations = [
    {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'Manuals',
      path: '/manuals'
    },
    {
      name: 'Maintenance',
      path: '/maintenance'
    },
    {
      name: 'Analytics',
      path: '/analytics',
    },
  ].map(path => {
    const classes = location.pathname.startsWith(path.path) ? activeClasses : inactiveClasses;
    return (
      <button className={classes} key={path.path}>{path.name}</button>
    );
  });
  
  return (
    <nav className="flex flex-col md:flex-row">
      {...locations}
    </nav>
  );
}