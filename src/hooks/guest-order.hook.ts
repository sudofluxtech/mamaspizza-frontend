"use client";

import { useState, useCallback } from 'react';
import { GUEST_ORDER_API, getGuestOrderByNumber } from '@/app/api';

export interface GuestOrderItem {
  id: number;
  order_id: number;
  item_id: number;
  item_name: string;
  item_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface GuestOrder {
  id: number;
  order_number: string;
  guest_id: string;
  delivery_type: 'delivery' | 'pickup';
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: {
    fields: string;
    address_line_1: string;
    address_line_2?: string;
    post_code: string;
    details?: string;
  };
  special_instructions?: string;
  payment_method: 'stripe' | 'cash' | 'card';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  tax_rate: number;
  delivery_fee: number;
  discount_amount: number;
  subtotal: number;
  total_amount: number;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  stripe_refund_id?: string;
  created_at: string;
  updated_at: string;
  items: GuestOrderItem[];
}

export interface CreateGuestOrderData {
  guest_id: string;
  delivery_type: 'delivery' | 'pickup';
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: {
    fields: string;
    address_line_1: string;
    address_line_2?: string;
    post_code: string;
    details?: string;
  };
  special_instructions?: string;
  payment_method: 'stripe' | 'cash' | 'card';
  tax_rate: number;
  delivery_fee: number;
  discount_amount: number;
}

export interface GuestOrderQueryParams {
  guest_id: string;
  per_page?: number;
  page?: number;
}

// GET all guest orders
export function useGuestOrders() {
  const [orders, setOrders] = useState<GuestOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchGuestOrders = useCallback(async (queryParams: GuestOrderQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('guest_id', queryParams.guest_id);
      
      if (queryParams.per_page) {
        searchParams.append('per_page', queryParams.per_page.toString());
      }
      if (queryParams.page) {
        searchParams.append('page', queryParams.page.toString());
      }
      
      const queryString = searchParams.toString();
      const url = `${GUEST_ORDER_API}?${queryString}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guest orders');
      }

      const result = await response.json();
      setOrders(result.data || []);
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
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchGuestOrders,
  };
}

// GET guest order by order number
export function useGuestOrder(orderNumber: string, guestId: string) {
  const [order, setOrder] = useState<GuestOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestOrder = useCallback(async () => {
    if (!orderNumber || !guestId) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('guest_id', guestId);
      
      const queryString = searchParams.toString();
      const url = `${getGuestOrderByNumber(orderNumber)}?${queryString}`;
      
  
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch guest order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderNumber, guestId]);

  return {
    order,
    loading,
    error,
    fetchGuestOrder,
  };
}

// CREATE guest order
export function useCreateGuestOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuestOrder = async (orderData: CreateGuestOrderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUEST_ORDER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create guest order');
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
    createGuestOrder,
    loading,
    error,
  };
}

// TRACK guest order (for order tracking page)
export function useTrackGuestOrder() {
  const [order, setOrder] = useState<GuestOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = useCallback(async (orderNumber: string, guestId: string) => {
    if (!orderNumber || !guestId) {
      setError('Order number and guest ID are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('guest_id', guestId);
      
      const queryString = searchParams.toString();
      const url = `${getGuestOrderByNumber(orderNumber)}?${queryString}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to track order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    order,
    loading,
    error,
    trackOrder,
  };
}
