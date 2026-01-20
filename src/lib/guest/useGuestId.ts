"use client";

import { useCallback, useEffect, useState } from 'react';

const GUEST_ID_KEY = 'mamas_guest_id';

// Generate 16-digit guest ID with uppercase letters and numbers
export const generateGuestId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';

  // First, ensure 3 numeric values are included
  let numericPart = '';
  for (let i = 0; i < 3; i++) {
    numericPart += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Fill the rest (13 chars) with uppercase letters and numbers
  const chars = letters + numbers;
  let rest = '';
  for (let i = 0; i < 13; i++) {
    rest += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Combine and shuffle to randomize numeric positions
  const combined = (numericPart + rest).split('');
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  result = combined.join('').toUpperCase();

  return result;
};

export const useGuestId = () => {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canOrder, setCanOrder] = useState<boolean>(false);

  // Memoized function to get or create guest ID
  const getOrCreateGuestId = useCallback(() => {
    try {
      // Check if guest ID already exists in localStorage
      const existingGuestId = localStorage.getItem(GUEST_ID_KEY);
      
      if (existingGuestId) {
        setGuestId(existingGuestId);
        return existingGuestId;
      }
      
      // Generate new guest ID if none exists
      const newGuestId = generateGuestId();
      localStorage.setItem(GUEST_ID_KEY, newGuestId);
      setGuestId(newGuestId);
      return newGuestId;
      
    } catch (error) {
      console.error('Error handling guest ID:', error);
      // Fallback: generate ID without localStorage
      const fallbackId = generateGuestId();
      setGuestId(fallbackId);
      return fallbackId;
    }
  }, []);

  // Initialize guest ID on mount
  useEffect(() => {
    getOrCreateGuestId();
    setIsLoading(false);
  }, [getOrCreateGuestId]);

  return {
    guestId,
    isLoading,
    refreshGuestId: getOrCreateGuestId,
    canOrder,
    setCanOrder,
  };
};
