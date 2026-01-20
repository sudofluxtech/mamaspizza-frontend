"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { POST_CODES_API, getPostCodeById, GUEST_POST_CODES_API, getGuestPostCodeById } from '@/app/api';

export interface PostCode {
  id: number;
  code: string;
  deliver_charge: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreatePostCodeData {
  code: string;
  deliver_charge: number;
  status: 'active' | 'inactive';
}

export interface UpdatePostCodeData {
  code?: string;
  deliver_charge?: number;
  status?: 'active' | 'inactive';
}

// GET all post codes (Public endpoint)
export function usePostCodes() {
  const [postCodes, setPostCodes] = useState<PostCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostCodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(POST_CODES_API, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post codes');
      }

      const result = await response.json();
      setPostCodes(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postCodes,
    loading,
    error,
    fetchPostCodes,
    // Backwards-compatible alias expected by some pages
    refetch: fetchPostCodes,
  };
}

// SEARCH post codes (Public endpoint)
export function useSearchPostCodes() {
  const [postCodes, setPostCodes] = useState<PostCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPostCodes = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPostCodes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('matchWith', searchTerm);
      
      const url = `${POST_CODES_API}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search post codes');
      }

      const result = await response.json();
      setPostCodes(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postCodes,
    loading,
    error,
    searchPostCodes,
  };
}

// GET post code by ID (Public endpoint)
export function usePostCode(postCodeId: string) {
  const [postCode, setPostCode] = useState<PostCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostCode = useCallback(async () => {
    if (!postCodeId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getPostCodeById(postCodeId), {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post code');
      }

      const result = await response.json();
      setPostCode(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postCodeId]);

  return {
    postCode,
    loading,
    error,
    fetchPostCode,
  };
}

// CREATE post code (Admin only)
export function useCreatePostCode() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPostCode = async (postCodeData: CreatePostCodeData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(POST_CODES_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(postCodeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post code');
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
    createPostCode,
    loading,
    error,
  };
}

// UPDATE post code (Admin only)
export function useUpdatePostCode() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePostCode = async (postCodeId: number, postCodeData: UpdatePostCodeData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getPostCodeById(postCodeId.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(postCodeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post code');
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
    updatePostCode,
    loading,
    error,
  };
}

// DELETE post code (Admin only)
export function useDeletePostCode() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePostCode = async (postCodeId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getPostCodeById(postCodeId.toString()), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post code');
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
    deletePostCode,
    loading,
    error,
  };
}

// ==================== GUEST POST CODES MANAGEMENT ====================

export interface GuestPostCode {
  id: number;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGuestPostCodeData {
  code: string;
}

// GET all guest post codes (Authentication required)
export function useGuestPostCodes() {
  const { token, isAuthenticated } = useAuth();
  const [guestPostCodes, setGuestPostCodes] = useState<GuestPostCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestPostCodes = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUEST_POST_CODES_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guest post codes');
      }

      const result = await response.json();
      setGuestPostCodes(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    guestPostCodes,
    loading,
    error,
    fetchGuestPostCodes,
  };
}

// CREATE guest post code (Public endpoint - no authentication required)
export function useCreateGuestPostCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuestPostCode = async (postCodeData: CreateGuestPostCodeData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUEST_POST_CODES_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(postCodeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create guest post code');
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
    createGuestPostCode,
    loading,
    error,
  };
}

// GET guest post code by ID (Authentication required)
export function useGuestPostCode(postCodeId: string) {
  const { token, isAuthenticated } = useAuth();
  const [guestPostCode, setGuestPostCode] = useState<GuestPostCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestPostCode = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    if (!postCodeId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestPostCodeById(postCodeId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guest post code');
      }

      const result = await response.json();
      setGuestPostCode(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, postCodeId]);

  return {
    guestPostCode,
    loading,
    error,
    fetchGuestPostCode,
  };
}

// UPDATE guest post code (Authentication required)
export function useUpdateGuestPostCode() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGuestPostCode = async (postCodeId: number, postCodeData: CreateGuestPostCodeData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestPostCodeById(postCodeId.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(postCodeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update guest post code');
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
    updateGuestPostCode,
    loading,
    error,
  };
}

// DELETE guest post code (Authentication required)
export function useDeleteGuestPostCode() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGuestPostCode = async (postCodeId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGuestPostCodeById(postCodeId.toString()), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete guest post code');
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
    deleteGuestPostCode,
    loading,
    error,
  };
}
