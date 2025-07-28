import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Z_INDEX_CLASSES } from '../../lib/constants/zIndex';
import { Card } from './Card';

import type { ReactNode, KeyboardEvent } from 'react';

/**
 * Props for Modal component
 * 
 * @public
 */
export interface ModalProps {
  /** Whether the modal is currently open and visible */
  isOpen: boolean;
  /** Function called when the modal should be closed (escape key, backdrop click) */
  onClose?: () => void;
  /** Content to display inside the modal */
  children: ReactNode;
  /** ID of the element that labels the modal for accessibility */
  ariaLabelledBy?: string;
}

export const Modal = ({ isOpen, onClose, children, ariaLabelledBy }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore previous focus
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div 
      className={`fixed inset-0 ${Z_INDEX_CLASSES.MODAL}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      tabIndex={-1}
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-text-secondary/50"/>
      <div className="relative flex items-center justify-center h-full p-4" onClick={handleBackdropClick}>
        <Card variant="subtle">
          {children}
        </Card>
      </div>
    </div>,
    document.body
  );
};