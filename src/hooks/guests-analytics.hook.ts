"use client";

import { useState, useEffect } from 'react';
import { GUESTS_API } from '@/app/api';

export interface GuestAnalytics {
  most_visited_page: string;
  most_visited_section: string;
  mobile_visited: number;
  desktop_visited: number;
}

export interface GuestAnalyticsResponse {
  success: boolean;
  data: GuestAnalytics;
}

export function useGuestAnalytics() {
  const [analytics, setAnalytics] = useState<GuestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${GUESTS_API}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const result: GuestAnalyticsResponse = await response.json();
      
      if (result.success) {
        setAnalytics(result.data);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching guest analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
}
