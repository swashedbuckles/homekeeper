import { useState } from 'react';

/**
 * Hook for copying text to clipboard with visual feedback state.
 * 
 * Provides a simple API for copying text with temporary "copied" state
 * that automatically resets after a specified duration.
 * 
 * @param resetDelay - Time in milliseconds before resetting copied state (default: 2000)
 * @returns Object with copyToClipboard function, copied state, and error state
 * 
 * @example
 * ```tsx
 * function CopyButton({ text }: { text: string }) {
 *   const { copyToClipboard, copied, error } = useCopyToClipboard();
 *   
 *   return (
 *     <Button onClick={() => copyToClipboard(text)}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </Button>
 *   );
 * }
 * ```
 * 
 * @example With custom reset delay
 * ```tsx
 * const { copyToClipboard, copied } = useCopyToClipboard(3000); // 3 second reset
 * ```
 */
export const useCopyToClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      
      // Auto-reset copied state after delay
      setTimeout(() => setCopied(false), resetDelay);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
      setError(errorMessage);
      console.error('Failed to copy text to clipboard:', err);
    }
  };

  return {
    copyToClipboard,
    copied,
    error,
  };
};