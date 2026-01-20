import { renderHook } from '@testing-library/react';
import { useCartCount } from '../useCartCount';
import { useCartStore } from '@/lib/stores/cartStore';

// Mock the cart store
jest.mock('@/lib/stores/cartStore');

describe('useCartCount', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should return 0 itemCount and false shouldShowCount initially', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      itemCount: 0,
      isHydrated: false,
    });

    const { result } = renderHook(() => useCartCount());

    expect(result.current.itemCount).toBe(0);
    expect(result.current.shouldShowCount).toBe(false);
    expect(result.current.isHydrated).toBe(false);
  });

  it('should return correct itemCount and true shouldShowCount when hydrated with items', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      itemCount: 5,
      isHydrated: true,
    });

    const { result } = renderHook(() => useCartCount());

    expect(result.current.itemCount).toBe(5);
    expect(result.current.shouldShowCount).toBe(true);
    expect(result.current.isHydrated).toBe(true);
  });

  it('should return 0 itemCount and false shouldShowCount when hydrated but no items', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      itemCount: 0,
      isHydrated: true,
    });

    const { result } = renderHook(() => useCartCount());

    expect(result.current.itemCount).toBe(0);
    expect(result.current.shouldShowCount).toBe(false);
    expect(result.current.isHydrated).toBe(true);
  });
});
