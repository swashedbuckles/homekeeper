import { Button } from './Button';

export interface ActionItemProps {
  title: string;
  subtitle?: string;
  actionText: string;
  onAction: () => void;
  actionVariant?: 'primary' | 'secondary' | 'text';
};

export const ActionItem = ({
  title, 
  subtitle, 
  actionText, 
  onAction,
  actionVariant
}: ActionItemProps) => {

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
      <div>
        <div className="font-mono text-lg font-semibold text-text-primary">{title}</div>
        {subtitle ? <div className="text-text-secondary text-sm">{subtitle}</div> : null }
      </div>
      <Button 
        className="text-sm" 
        onClick={onAction} 
        variant={actionVariant ?? 'text'}
        >{actionText}</Button>
    </div>
  );

};