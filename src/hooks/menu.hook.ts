"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { ITEMS_API } from "@/app/api";

export interface MenuItem {
  id: number;
  name: string;
  category_id: number;
  size_id: number;
  details: string;
  main_price: string;
  prev_price: string;
  thumbnail: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
  size?: {
    id: number;
    size: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface MenuResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: MenuItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// GET menus with query parameters
export function useMenus(params?: {
  category_id?: string;
  size_id?: number;
  per_page?: number;
  page?: number;
  search?: string;
  ordering?: string;
  status?: number;
}) {
  // const { token } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  } | null>(null);

  const fetchMenus = useCallback(async (queryParams?: {
    category_id?: string;
    size_id?: number;
    per_page?: number;
    page?: number;
    search?: string;
    ordering?: string;
    status?: number;
  }) => {
    // if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // Build query string
      const searchParams = new URLSearchParams();
      if (queryParams?.category_id) {
        searchParams.append('category_id', queryParams.category_id);
      }
      if (queryParams?.size_id) {
        searchParams.append('size_id', queryParams.size_id.toString());
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
      if (queryParams?.ordering) {
        searchParams.append('ordering', queryParams.ordering);
      }
      if (queryParams?.status !== undefined) {
        searchParams.append('status', queryParams.status.toString());
      }
      
      const queryString = searchParams.toString();
        const url = `${ITEMS_API}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const responseData = await response.json();
      // console.log('API Response:', responseData);
      
      // Handle the API response structure: {success: true, message: "...", data: {...}}
      if (responseData.success && responseData.data && Array.isArray(responseData.data.data)) {
        setMenus(responseData.data.data);
        // Set pagination from the nested data structure
        setPagination({
          current_page: responseData.data.current_page,
          total_pages: responseData.data.last_page,
          per_page: responseData.data.per_page,
          total_items: responseData.data.total,
          has_next_page: responseData.data.next_page_url !== null,
          has_prev_page: responseData.data.prev_page_url !== null,
          next_page_url: responseData.data.next_page_url,
          prev_page_url: responseData.data.prev_page_url,
        });
      } else {
        setMenus([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus({
      category_id: params?.category_id,
      per_page: params?.per_page,
      size_id: params?.size_id,
      page: params?.page,
      search: params?.search,
      ordering: params?.ordering,
      status: params?.status,
    });
  }, [fetchMenus, params?.category_id, params?.per_page, params?.page, params?.search, params?.size_id, params?.ordering, params?.status]);

  return { menus, loading, error, pagination, refetch: fetchMenus };
}

// CREATE menu
export function useCreateMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMenu = async (menuData: {
    title: string;
    category_id: string;
    description: string;
    short_description: string;
    regular_price: string;
    actual_price: string;
    thumbnail?: string;
    status?: "active" | "inactive";
  }) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
        const response = await fetch(ITEMS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(menuData),
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

  return { createMenu, loading, error };
}

// UPDATE menu
export function useUpdateMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMenu = async (
    id: string,
    menuData: {
      name?: string;
      category_id?: string;
      details?: string;
      main_price?: string;
      prev_price?: string;
      thumbnail?: string;
      status?: string;
      size_id?: string;
    }
  ) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(menuData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'thumbnail' && value && typeof value === 'object' && (value as any).constructor === File) {
            formData.append('thumbnail', value as File);
          } else if (key === 'status') {
            // Handle status as 0 or 1 for API
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${ITEMS_API}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }
      
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateMenu, loading, error };
}

// DELETE menu
export function useDeleteMenu() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMenu = async (id: string) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('_method', 'DELETE');

      const response = await fetch(`${ITEMS_API}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }
      
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteMenu, loading, error };
}
