"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { DELIVERY_ADDRESSES_API, getDeliveryAddressById } from '@/app/api';

export interface DeliveryAddress {
  id: number;
  user_id: number;
  address_line_1: string;
  address_line_2: string;
  city: string; // Added city field for new payload structure
  post_code: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDeliveryAddressData {
  address_line_1: string;
  address_line_2: string;
  city: string;
  post_code: string;
  details: string;
}

export interface UpdateDeliveryAddressData {
  fields?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  post_code?: string;
  details?: string;
}

// GET delivery addresses
export function useDeliveryAddresses() {
  const { token, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(DELIVERY_ADDRESSES_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch delivery addresses');
      }

      const result = await response.json();
      setAddresses(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
  };
}

// CREATE delivery address
export function useCreateDeliveryAddress() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAddress = async (addressData: CreateDeliveryAddressData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(DELIVERY_ADDRESSES_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create delivery address');
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
    createAddress,
    loading,
    error,
  };
}

// UPDATE delivery address
export function useUpdateDeliveryAddress() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAddress = async (addressId: number, addressData: UpdateDeliveryAddressData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getDeliveryAddressById(addressId.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update delivery address');
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
    updateAddress,
    loading,
    error,
  };
}

// DELETE delivery address
export function useDeleteDeliveryAddress() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAddress = async (addressId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getDeliveryAddressById(addressId.toString()), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete delivery address');
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
    deleteAddress,
    loading,
    error,
  };
}