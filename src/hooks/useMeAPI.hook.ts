"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { authAPI } from '@/lib/api/auth.api';

export interface MeAPIResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export function useMeAPI() {
  const { token, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const fetchMe = useCallback(async (): Promise<MeAPIResponse> => {
    if (!isAuthenticated || !token) {
      const errorMsg = 'User not authenticated';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await authAPI.fetchProfile(token);
      
      if (result.success && result.user) {
        setUserData(result.user);
        // Update the auth state with fresh data
        updateUser(result.user);
        console.log('Updated user data:', result.user);
        return {
          success: true,
          data: result.user,
          message: result.message || 'Profile fetched successfully'
        };
      } else {
        const errorMsg = result.message || 'Failed to fetch profile';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Network error occurred';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, updateUser]);

  const refetch = useCallback(async (): Promise<MeAPIResponse> => {
    return await fetchMe();
  }, [fetchMe]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    userData,
    loading,
    error,
    fetchMe,
    refetch,
    clearError,
    isAuthenticated,
  };
}
