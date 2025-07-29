import { Settings, House, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';
import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';

import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Text } from '../common/Text';
import { Title } from '../common/Title';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { activeHousehold } = useHousehold();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const profileDropdownClasses = [
    'bg-white',
    'border-4 border-text-primary',
    'md:brutal-shadow-secondary',
    'md:brutal-rotate-tiny-right',
    'md:min-w-60'
  ].join(' ');

  const dropdownHeaderClasses = [
    'bg-primary text-white',
    'border-b-4 border-b-text-primary',
    'p-4',
    'font-black uppercase text-sm tracking-wider'
  ].join(' ');

  const dropdownItemClasses = [
    'px-4 py-3.5',
    'border-b-2 border-b-background',
    'font-bold uppercase text-sm tracking-wider',
    'text-text-primary',
    'cursor-pointer',
    'brutal-transition',
    'flex items-center gap-3',
    'hover:bg-background hover:text-primary',
    'last:border-b-0'
  ].join(' ');

  const logoutItemClasses = [
    'px-4 py-3.5',
    'font-bold uppercase text-sm tracking-wider',
    'cursor-pointer',
    'brutal-transition',
    'flex items-center gap-3',
    'bg-error text-white',
    'border-t-4 border-t-text-primary',
    'hover:bg-red-800 hover:text-white'
  ].join(' ');

  const dropdownDividerClasses = 'h-1 bg-text-primary m-0';

  return (
    <div className={`${Z_INDEX_CLASSES.MOBILE_MENU} ${profileDropdownClasses}`}>
      <div className={dropdownHeaderClasses}>
        {user?.name ?? 'NAME'} <br />
        <span className="text-xs opacity-80">{activeHousehold?.name ?? 'HOUSEHOLD'}</span>
      </div>

      <div className={dropdownItemClasses}>
        <span className="text-lg"><House /></span>
        Switch Household
      </div>

      <div className={dropdownDividerClasses}></div>

      <div className={dropdownItemClasses} onClick={() => navigate('/settings')}>
        <span className="text-lg"><Settings /></span>
        Settings
      </div>

      <div className={logoutItemClasses} onClick={() => setIsModalOpen(true)} >
        <span className="text-lg"><LogOut /></span>
        Logout
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        ariaLabelledBy="modal-title"
      >
        <div className="p-8 max-w-lg">
          <Title variant="subsection" className="mb-4">
            Confirm Logout
          </Title>
          <Text variant="body" className="mb-6">
            Are you sure you want to logout? We'll miss you!
          </Text>
          <div className="mt-4 flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                logout();
                setIsModalOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}