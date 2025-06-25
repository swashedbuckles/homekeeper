/**
 * Full-width container for hero secions, headers, etc.
 * 
 * @param children nested content
 * @param className additional styles to apply
 */
export const FullWidthContainer = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};
