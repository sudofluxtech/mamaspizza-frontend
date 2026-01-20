"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { GET_ALL_USERS_API } from "@/app/api";

export interface DeliveryAddress {
  id: number;
  city: string;
  fields: string;
  country: string;
  details: string;
  road_no: string;
  house_no: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  user_image?: string | null;
  delivery_address?: DeliveryAddress | null;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      has_more_pages: boolean;
    };
  };
}

// GET users with query parameters
export function useUsers(params?: {
  role?: string;
  per_page?: number;
  page?: number;
  search?: string;
}) {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    from: number;
    to: number;
  } | null>(null);

  const fetchUsers = useCallback(async (queryParams?: {
    role?: string;
    per_page?: number;
    page?: number;
    search?: string;
  }) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // Build query string
      const searchParams = new URLSearchParams();
      if (queryParams?.role) {
        searchParams.append('role', queryParams.role);
      }
      if (queryParams?.per_page) {
        searchParams.append('per_page', queryParams.per_page.toString());
      }
      if (queryParams?.page) {
        searchParams.append('page', queryParams.page.toString());
      }
      if (queryParams?.search) {
        searchParams.append('search', queryParams.search);
      }
      
      const queryString = searchParams.toString();
      const url = `${GET_ALL_USERS_API}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: UsersResponse = await response.json();
      
      // Handle the API response structure: {success: true, message: "...", data: {users: [...], pagination: {...}}}
      if (responseData.success && responseData.data && Array.isArray(responseData.data.users)) {
        setUsers(responseData.data.users);
        // Set pagination from the nested data structure
        setPagination({
          current_page: responseData.data.pagination.current_page,
          total_pages: responseData.data.pagination.last_page,
          per_page: responseData.data.pagination.per_page,
          total_items: responseData.data.pagination.total,
          has_next_page: responseData.data.pagination.has_more_pages,
          has_prev_page: responseData.data.pagination.current_page > 1,
          from: responseData.data.pagination.from,
          to: responseData.data.pagination.to,
        });
      } else {
        setUsers([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers({
      role: params?.role,
      per_page: params?.per_page,
      page: params?.page,
      search: params?.search,
    });
  }, [fetchUsers, params?.role, params?.per_page, params?.page, params?.search]);

  return { users, loading, error, pagination, refetch: fetchUsers };
}

// CREATE user
export function useCreateUser() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    role?: string;
  }) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GET_ALL_USERS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}

// UPDATE user
export function useUpdateUser() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (
    id: string,
    userData: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      status?: string;
    }
  ) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GET_ALL_USERS_API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

// DELETE user
export function useDeleteUser() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GET_ALL_USERS_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
