/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { CONTACTS_API } from "@/app/api";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFilters {
  search?: string;
  per_page?: number;
  page?: number;
}

export interface ContactPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  from: number;
  to: number;
  has_prev_page: boolean;
  has_next_page: boolean;
}

// GET all contacts
export function useContacts(filters: ContactFilters = {}) {
  const { token, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ContactPagination | null>(null);

  const fetchContacts = useCallback(async (customFilters?: ContactFilters) => {
    if (!isAuthenticated || !token) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      const activeFilters = { ...filters, ...customFilters };
      
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.per_page) params.append('per_page', activeFilters.per_page.toString());
      if (activeFilters.page) params.append('page', activeFilters.page.toString());

      const url = `${CONTACTS_API}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const result = await response.json();
      setContacts(result.data || []);
      setPagination(result.pagination || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, filters]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    pagination,
    refetch: fetchContacts,
  };
}

// GET contact by ID
export function useContact(contactId: string) {
  const { token, isAuthenticated } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${CONTACTS_API}/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contact");
      }

      const result = await response.json();
      setContact(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, contactId]);

  return {
    contact,
    loading,
    error,
    fetchContact,
  };
}

// DELETE contact
export function useDeleteContact() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteContact = async (contactId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${CONTACTS_API}/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(errorData.message || "Contact not found");
        }
        throw new Error(errorData.message || "Failed to delete contact");
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
    deleteContact,
    loading,
    error,
  };
}
