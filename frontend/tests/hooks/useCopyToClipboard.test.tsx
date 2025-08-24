import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useCopyToClipboard } from '../../src/hooks/useCopyToClipboard';

// Mock the clipboard API
const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.copyToClipboard).toBe('function');
  });

  it('should successfully copy text to clipboard', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('Hello World');
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('Hello World');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should reset copied state after default delay', async () => {
    vi.useFakeTimers();
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('Test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000); // Default delay
    });

    expect(result.current.copied).toBe(false);
  });

  it('should reset copied state after custom delay', async () => {
    vi.useFakeTimers();
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard(3000));
    
    await act(async () => {
      await result.current.copyToClipboard('Test text');
    });

    expect(result.current.copied).toBe(true);

    // Should still be true after default delay
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(true);

    // Should be false after custom delay
    act(() => {
      vi.advanceTimersByTime(1000); // Total 3000ms
    });
    expect(result.current.copied).toBe(false);
  });

  it('should handle clipboard write errors', async () => {
    const error = new Error('Clipboard API not available');
    mockClipboard.writeText.mockRejectedValue(error);
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('Test text');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe('Clipboard API not available');
  });

  it('should handle non-Error exceptions', async () => {
    mockClipboard.writeText.mockRejectedValue('String error');
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('Test text');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe('Failed to copy to clipboard');
  });

  it('should clear error on successful copy', async () => {
    // First copy fails
    mockClipboard.writeText.mockRejectedValueOnce(new Error('First error'));
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('Test text');
    });

    expect(result.current.error).toBe('First error');

    // Second copy succeeds
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    await act(async () => {
      await result.current.copyToClipboard('Test text 2');
    });

    expect(result.current.error).toBe(null);
    expect(result.current.copied).toBe(true);
  });

  it('should handle multiple calls correctly', async () => {
    vi.useFakeTimers();
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    
    // First copy
    await act(async () => {
      await result.current.copyToClipboard('First text');
    });

    expect(result.current.copied).toBe(true);

    // Second copy before timeout
    await act(async () => {
      await result.current.copyToClipboard('Second text');
    });

    expect(result.current.copied).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(2);
    expect(mockClipboard.writeText).toHaveBeenLastCalledWith('Second text');

    // Should reset after delay
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });
});