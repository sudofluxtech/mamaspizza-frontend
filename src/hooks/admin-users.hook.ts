"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { CREATE_USER_API, USERS_API } from '@/app/api';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  user_image?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'staff' | 'user';
}

export interface UsersQueryParams {
  per_page?: number;
  search?: string;
  role?: 'admin' | 'staff' | 'user' | '';
}

// GET all users (Admin only)
export function useAdminUsers() {
  const { token, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchUsers = useCallback(async (queryParams?: UsersQueryParams) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (queryParams?.per_page) {
        searchParams.append('per_page', queryParams.per_page.toString());
      }
      if (queryParams?.search) {
        searchParams.append('search', queryParams.search);
      }
      if (queryParams?.role) {
        searchParams.append('role', queryParams.role);
      }
      
      const queryString = searchParams.toString();
      const url = `${USERS_API}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      setUsers(result.data || []);
      setPagination({
        current_page: result.current_page || 1,
        last_page: result.last_page || 1,
        per_page: result.per_page || 15,
        total: result.total || 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
  };
}

// CREATE user (Admin only)
export function useCreateUser() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: CreateUserData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CREATE_USER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
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
    createUser,
    loading,
    error,
  };
}

// SEARCH users by name or email
export function useSearchUsers() {
  const { token, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(async (searchTerm: string, perPage: number = 10) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    if (!searchTerm.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('search', searchTerm);
      searchParams.append('per_page', perPage.toString());
      
      const url = `${USERS_API}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const result = await response.json();
      setUsers(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    users,
    loading,
    error,
    searchUsers,
  };
}

// FILTER users by role
export function useFilterUsersByRole() {
  const { token, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterUsersByRole = useCallback(async (role: 'admin' | 'staff' | 'user', perPage: number = 20) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('role', role);
      searchParams.append('per_page', perPage.toString());
      
      const url = `${USERS_API}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to filter users by role');
      }

      const result = await response.json();
      setUsers(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    users,
    loading,
    error,
    filterUsersByRole,
  };
}
