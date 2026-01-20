"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { ADMIN_ORDERS_API } from "@/app/api";

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  item_name: string;
  item_description: string;
  item_thumbnail: string;
  item_price: string;
  item_prev_price: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  category_name: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  item: {
    id: number;
    name: string;
    thumbnail: string;
    main_price: string;
    prev_price: string;
    details: string;
    category_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  guest_id: string | null;
  delivery_address_id: number | null;
  status: string;
  subtotal: string;
  tax_amount: string;
  delivery_fee: string;
  discount_amount: string;
  total_amount: string;
  payment_status: string;
  payment_method: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  stripe_refund_id: string | null;
  payment_details: any;
  paid_at: string | null;
  delivery_type: string;
  estimated_delivery_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  special_instructions: string | null;
  admin_notes: string | null;
  confirmed_at: string | null;
  prepared_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  delivery_address: any | null;
  user: any | null;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Order[];
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
  summary: {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    paid_orders: number;
    pending_payments: number;
    total_revenue: string;
    authenticated_orders: number;
    guest_orders: number;
  };
}

// GET orders with query parameters
export function useAdminOrders(params?: {
  status?: string;
  payment_status?: string;
  per_page?: number;
  page?: number;
  search?: string;
}) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
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
  const [summary, setSummary] = useState<{
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    paid_orders: number;
    pending_payments: number;
    total_revenue: string;
    authenticated_orders: number;
    guest_orders: number;
  } | null>(null);

  const fetchOrders = useCallback(async (queryParams?: {
    status?: string;
    payment_status?: string;
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
      if (queryParams?.status) {
        searchParams.append('status', queryParams.status);
      }
      if (queryParams?.payment_status) {
        searchParams.append('payment_status', queryParams.payment_status);
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
      const url = `${ADMIN_ORDERS_API}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: OrdersResponse = await response.json();
      
      // Handle the API response structure: {success: true, message: "...", data: {data: [...], current_page: 1, ...}}
      if (responseData.success && responseData.data && Array.isArray(responseData.data.data)) {
        setOrders(responseData.data.data);
        // Set pagination from the data structure
        setPagination({
          current_page: responseData.data.current_page,
          total_pages: responseData.data.last_page,
          per_page: responseData.data.per_page,
          total_items: responseData.data.total,
          has_next_page: responseData.data.next_page_url !== null,
          has_prev_page: responseData.data.prev_page_url !== null,
          from: responseData.data.from,
          to: responseData.data.to,
        });
        // Set summary data
        if (responseData.summary) {
          setSummary(responseData.summary);
        }
      } else {
        setOrders([]);
        setPagination(null);
        setSummary(null);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders({
      status: params?.status,
      payment_status: params?.payment_status,
      per_page: params?.per_page,
      page: params?.page,
      search: params?.search,
    });
  }, [fetchOrders, params?.status, params?.payment_status, params?.per_page, params?.page, params?.search]);

  return { orders, loading, error, pagination, summary, refetch: fetchOrders };
}

// UPDATE order status
export function useUpdateOrderStatus() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ADMIN_ORDERS_API}/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({ status }),
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

  return { updateOrderStatus, loading, error };
}

// CANCEL order
export function useCancelOrder() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async (orderId: string) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ADMIN_ORDERS_API}/${orderId}/cancel`, {
        method: "POST",
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

  return { cancelOrder, loading, error };
}