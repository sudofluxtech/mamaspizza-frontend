"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { 
  ORDERS_API, 
  getOrderById, 
  cancelOrder, 
  getOrderSummary, 
  updateOrderPaymentStatus 
} from '@/app/api';

export interface OrderItem {
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

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  delivery_address_id: number;
  delivery_type: 'delivery' | 'pickup';
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
  items: OrderItem[];
  delivery_address?: {
    id: number;
    fields: string;
    address_line_1: string;
    address_line_2: string;
    post_code: string;
    details: string;
  };
}

export interface CreateOrderData {
  delivery_address_id: number | null;
  delivery_type: 'delivery' | 'pickup';
  special_instructions?: string;
  payment_method: 'stripe' | 'cash' | 'card';
  tax_rate: number;
  delivery_fee: number;
  discount_amount: number;
}

export interface OrderQueryParams {
  status?: string;
  per_page?: number;
  page?: number;
}

export interface PaymentStatusUpdate {
  payment_status: 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  stripe_refund_id?: string;
  payment_details?: {
    payment_method?: string;
    card_brand?: string;
    card_last4?: string;
    amount?: number;
    error_code?: string;
    error_message?: string;
    decline_code?: string;
    refund_amount?: number;
    refund_reason?: string;
    refund_status?: string;
  };
}

// GET all orders
export function useOrders() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchOrders = useCallback(async (queryParams?: OrderQueryParams) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (queryParams?.status) {
        searchParams.append('status', queryParams.status);
      }
      if (queryParams?.per_page) {
        searchParams.append('per_page', queryParams.per_page.toString());
      }
      if (queryParams?.page) {
        searchParams.append('page', queryParams.page.toString());
      }
      
      const queryString = searchParams.toString();
      const url = `${ORDERS_API}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
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
  }, [isAuthenticated, token]);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
  };
}

// GET order by ID
export function useOrder(orderId: string) {
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getOrderById(orderId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, orderId]);

  return {
    order,
    loading,
    error,
    fetchOrder,
  };
}

// CREATE order
export function useCreateOrder() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderData) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ORDERS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
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
    createOrder,
    loading,
    error,
  };
}

// CANCEL order
export function useCancelOrder() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrderRequest = async (orderId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(cancelOrder(orderId.toString()), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
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
    cancelOrder: cancelOrderRequest,
    loading,
    error,
  };
}

// GET order summary
export function useOrderSummary() {
  const { token, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderSummary = useCallback(async (orderId: string) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getOrderSummary(orderId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order summary');
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    summary,
    loading,
    error,
    fetchOrderSummary,
  };
}

// UPDATE payment status
export function useUpdatePaymentStatus() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePaymentStatus = async (orderId: number, paymentData: PaymentStatusUpdate) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(updateOrderPaymentStatus(orderId.toString()), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment status');
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
    updatePaymentStatus,
    loading,
    error,
  };
}
