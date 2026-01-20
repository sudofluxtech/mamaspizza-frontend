"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { CATEGORIES_API } from '@/app/api';

export interface Category {
  id: string;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

// GET categories
export function useCategories() {
  // const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    // if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(CATEGORIES_API, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Handle the API response structure: {success: true, message: "...", data: []}
      if (responseData.success && Array.isArray(responseData.data)) {
        setCategories(responseData.data);
      } else {
        console.warn('Categories API returned unexpected structure:', responseData);
        setCategories([]);
      }
    } catch (err: any) {
      console.error('Categories API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

// CREATE category
export function useCreateCategory() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (categoryData: { name: string }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch(CATEGORIES_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(categoryData),
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

  return { createCategory, loading, error };
}

// UPDATE category
export function useUpdateCategory() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = async (id: string, categoryData: { name: string }) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch(`${CATEGORIES_API}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(categoryData),
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

  return { updateCategory, loading, error };
}

// DELETE category
export function useDeleteCategory() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = async (id: string) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch(`${CATEGORIES_API}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  return { deleteCategory, loading, error };
}
