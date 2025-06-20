import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface BackButtonProps {
  label?: string;
  historyOverride?: string;
}

export const BackButton = ({label = 'Back', historyOverride}: BackButtonProps) => {
  const navigate = useNavigate();
  const onClick = () => {
    if(historyOverride) {
      navigate(historyOverride);
      return;
    }

    navigate(-1);
  };

  const ButtonClasses = 'text-secondary hover:text-text-primary transition-colors mb-4';
  const IconClasses = 'w-5 h-5 inline mr-2';

  return (
    <button className={ButtonClasses} onClick={onClick}>
      <ChevronLeft className={IconClasses} />
      {label}
    </button>
  );
};