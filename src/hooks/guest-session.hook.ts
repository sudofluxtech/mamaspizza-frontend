"use client";

import { useState, useCallback } from 'react';
import { GUESTS_API } from '@/app/api';

export interface CreateGuestSessionData {
  guest_id: string;
  ref?: string;
  device_type: string;
  browser: string;
}

export interface GuestSessionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    guest_id: string;
    session: number;
    ref: string;
    device_type: string;
    browser: string;
    page_visits?: any[];
    created_at: string;
    updated_at: string;
  };
}

// CREATE guest session (Public endpoint - no authentication required)
export function useCreateGuestSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuestSession = async (sessionData: CreateGuestSessionData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUESTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create guest session');
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createGuestSession,
    loading,
    error,
  };
}
