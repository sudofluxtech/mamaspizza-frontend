'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { SIZES_API, getSizeById } from '@/app/api';

// ==================== TYPES ====================
export interface Size {
  id: string;
  size: number;
  status: 'active' | 'inactive' | string | number;
  created_at: string;
  updated_at: string;
}

export interface CreateSizeData {
  size: number;
  status: number;
}

export interface UpdateSizeData {
  size?: string;
  status?: 'active' | 'inactive';
}


// ==================== HOOKS ====================

// Hook to fetch all sizes (public - no authentication required)
export function useSizes() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(SIZES_API, {
        headers: {
          'Accept': 'application/json',
        },
      });

   

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setSizes(result.data);
        return result.data as Size[];
      } else {
        console.warn('Sizes API returned unsuccessful response:', result);
        setSizes([]);
      }
    } catch (err: any) {
      console.error('Error fetching sizes:', err);
      setError(err.message);
      setSizes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const refetch = useCallback(() => {
    return fetchSizes();
  }, [fetchSizes]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sizes,
    loading,
    error,
    fetchSizes,
    refetch,
    clearError,
  };
}

// Hook to create a new size
export function useCreateSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSize = useCallback(async (data: CreateSizeData): Promise<Size | null> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Always send status as 1 (active) for sizes
      const apiData = {
        ...data,
        status: 1
      };

      const response = await fetch(SIZES_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create size');
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data as Size;
      } else {
        throw new Error(result.message || 'Failed to create size');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createSize,
    loading,
    error,
    clearError,
  };
}

// Hook to update an existing size
export function useUpdateSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSize = useCallback(async (id: string, data: UpdateSizeData): Promise<Size | null> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert status to 0/1 for API
      const apiData = {
        ...data,
        status: data.status ? (data.status === 'active' ? 1 : 0) : undefined
      };

      const response = await fetch(getSizeById(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update size');
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data as Size;
      } else {
        throw new Error(result.message || 'Failed to update size');
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateSize,
    loading,
    error,
    clearError,
  };
}

// Hook to delete a size
export function useDeleteSize() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSize = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getSizeById(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete size');
      }

      const result = await response.json();
      return result.success || false;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteSize,
    loading,
    error,
    clearError,
  };
}
