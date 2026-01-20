"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";

/**
 * Custom hook to handle cart count with proper hydration
 * This prevents hydration mismatches between server and client
 */
export function useCartCount() {
  const { itemCount, isHydrated } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only show the count after both client-side hydration and store hydration
  const shouldShowCount = isClient && isHydrated && itemCount > 0;
  const displayCount = shouldShowCount ? itemCount : 0;

  return {
    itemCount: displayCount,
    isHydrated: isClient && isHydrated,
    shouldShowCount,
  };
}
