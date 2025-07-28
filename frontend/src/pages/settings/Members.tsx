import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Option, Select } from '../../components/form/Select';

import type { ReactNode } from 'react';

export interface DisplayTag {
  variant?: 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  text: string;
}

export interface MemberListItemProps {
  title: string;
  subtitle?: string;
  initial?: string;
  children?: ReactNode;
  variant?: 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  initialColor?: 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
  className?: string;
  tags?: Array<string | DisplayTag>
}

export const MemberListItem = ({
  title,
  subtitle,
  initial,
  initialColor = 'dark',
  children,
  variant = 'default',
  className,
  tags,
}: MemberListItemProps) => {
  const variantStyles = {
    default:   ['bg-white', 'text-text-primary'],
    subtle:    ['bg-background', 'text-text-primary'],
    primary:   ['bg-primary', 'text-white'],
    secondary: ['bg-secondary', 'text-white'],
    accent:    ['bg-accent', 'text-white'],
    danger:    ['bg-error', 'text-white'],
    dark:      ['bg-text-primary', 'text-white'],
  };

  const containerStyles = [
    'border-4 border-text-primary p4 md:p-6',
    ...variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  const initialStyle = [
    'w-12 h-12 md:w-16 md:h-16 border-3 md:border-4',
    'flex items-center justify-center text-lg md:text-2xl font-black',
    variantStyles[variant][1].replace('text-', 'border-'),
    ...variantStyles[initialColor]
  ].join(' ');

  const renderedTags = (tags ?? []).map(tag => {
    const { variant = 'default', text } = (typeof tag === 'string' ? { text: tag, variant: 'default' } : tag);
    const style = `${variantStyles[variant].join(' ')} px-2 py-1 font-black brutal-rotate-slight-left`;
    console.log({variant, text, style});
    return (
      <span className={style}>{text}</span>
    );
  });

  return (
    <div className={containerStyles}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6 flex-1">
          <div className={initialStyle}>{initial || title.charAt(0)}</div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase">{title}</h3>
            <p className="font-bold uppercase text-sm">{subtitle}</p>
            <p className="font-bold uppercase text-sm mt-1">{renderedTags}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export const MembersSettings = () => {
  return (
    <Card shadow="double">
      <div className="space-y-4 md:space-y-6">
        <MemberListItem variant="primary" title="Alison Smith" subtitle="alison@example.com" tags={['owner']}>
          <div className="text-white font-bold uppercase text-xs md:text-sm text-center sm:text-right">
            You cannot modify your own role
          </div>
        </MemberListItem>
        <MemberListItem initialColor="secondary" title="John Smith" subtitle="john@example.com">
          <Select label="" grouped>
            <Option value="admin">Admin</Option>
            <Option value="member">Member</Option>
            <Option value="guest">Guest</Option>
          </Select>
          <Button size="md" variant="secondary">Update</Button>
          <Button size="md" variant="danger">Remove</Button>
        </MemberListItem>
        <MemberListItem title="Sarah Smith" initialColor="accent" subtitle="sarah@example.com">
          <Select label="" grouped>
            <Option value="admin">Admin</Option>
            <Option value="member">Member</Option>
            <Option value="guest">Guest</Option>
          </Select>
          <Button size="md" variant="secondary">Update</Button>
          <Button size="md" variant="danger">Remove</Button>
        </MemberListItem>
        </div>
    </Card>
  );
};
