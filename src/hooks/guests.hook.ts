"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { GUESTS_API, getGuestById } from '@/app/api';

export interface PageVisit {
  in_time: string;
  out_time: string;
  page_name: string;
  section_name: string;
  total_duration: number;
}

export interface Guest {
  id: number;
  guest_id: string;
  session: number;
  ref: string;
  device_type: string;
  browser: string;
  page_visits?: PageVisit[] | null;
  created_at: string;
  updated_at: string;
}

export interface GuestSessionResponse {
  success: boolean;
  message: string;
  data: Guest;
}

// GET all guests (Admin only)
export function useGuests() {
  const { token, isAuthenticated } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUESTS_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guests');
      }

      const result = await response.json();
      setGuests(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    guests,
    loading,
    error,
    fetchGuests,
    // Backwards-compatible alias expected by some pages
    refetch: fetchGuests,
  };
}

// GET guest by ID (Admin only)
export function useGuest(guestId: string) {
  const { token, isAuthenticated } = useAuth();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuest = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    if (!guestId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestById(guestId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guest');
      }

      const result = await response.json();
      setGuest(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, guestId]);

  return {
    guest,
    loading,
    error,
    fetchGuest,
  };
}

// UPDATE guest session (Admin only)
export function useUpdateGuestSession() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGuestSession = async (guestId: string, sessionData: Partial<Guest>) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestById(guestId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update guest session');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateGuestSession,
    loading,
    error,
  };
}

// DELETE guest (Admin only)
export function useDeleteGuest() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGuest = async (guestId: string) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestById(guestId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete guest');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteGuest,
    loading,
    error,
  };
}
