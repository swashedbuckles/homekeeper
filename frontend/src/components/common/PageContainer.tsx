
export const PageContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {children}
    </div>
  );
};