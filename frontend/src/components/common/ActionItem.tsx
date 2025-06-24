import type { ReactNode } from 'react';

export interface ActionItemProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode
};

export const ActionItem = ({
  title,
  subtitle,
  actions
}: ActionItemProps) => {

  return (
    <div className="flex items-center justify-between p-2 bg-background rounded-lg">
      <div>
        <div className="font-mono text-lg font-semibold text-text-primary">{title}</div>
        {subtitle ? <div className="text-text-secondary text-sm">{subtitle}</div> : null}
      </div>

      {actions}

    </div>
  );

};