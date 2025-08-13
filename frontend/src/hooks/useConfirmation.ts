import { useContext } from 'react';
import { ConfirmationContext } from '../context/confirmationContexts';

/**
 * Hook to access the confirmation service.
 * 
 * Returns a function that can be used to show confirmation dialogs and get the user's response.
 * The function returns a Promise that resolves to true if the user confirms, false if they cancel.
 * 
 * @throws {Error} If used outside of a ConfirmationProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const confirm = useConfirmation();
 *   
 *   const handleDelete = async () => {
 *     const result = await confirm({
 *       title: "Delete Item",
 *       message: "Are you sure you want to delete this item?",
 *       confirmText: "Delete",
 *       cancelText: "Cancel",
 *       variant: "danger"
 *     });
 *     
 *     if (result) {
 *       // User confirmed - proceed with deletion
 *       await deleteItem();
 *     }
 *   };
 *   
 *   return <button onClick={handleDelete}>Delete</button>;
 * }
 * ```
 * 
 * @example With minimal configuration
 * ```tsx
 * const confirm = useConfirmation();
 * 
 * const result = await confirm({
 *   title: "Confirm Action",
 *   message: "Are you sure?"
 * });
 * // Uses default "Confirm"/"Cancel" buttons with primary variant
 * ```
 */
export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  
  return context.showConfirmation;
};