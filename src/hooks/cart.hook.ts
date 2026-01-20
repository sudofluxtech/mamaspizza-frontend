/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { useCartStore } from "@/lib/stores/cartStore";
import { useGuest } from "@/lib/guest/GuestProvider";
import { USER_CART_API, GUEST_CART_API, CART_SUMMARY_API, USER_BOGO_OFFERS_API } from "@/app/api";

export interface CartItemData {
  id: number;
  user_id: number | null;
  guest_id: string | null;
  item_id: number;
  offer_id: number | null;
  quantity: number;
  price: number | null;
  discount: number | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
  bogo_offer_id: number | null;
  bogo_price: string | null;
  is_bogo_item: boolean;
  special_instructions: string | null;
  total_price: number;
  item: {
    id: number;
    name: string;
    thumbnail: string;
    main_price: string;
    prev_price: string;
    details: string;
    category_id: number;
    size_id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    category: {
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface BogoOffer {
  id: number;
  title: string;
  description: string;
  buy_quantity: number;
  get_quantity: number;
  category_id: number;
  item_ids: number[] | null;
  is_active: boolean;
  thumbnail: string | null;
  terms_conditions: string;
  created_at: string;
  updated_at: string;
}

export interface BogoBundle {
  bogo_offer_id: number;
  buy_items: Array<{
    id: number;
    quantity: number;
    name: string;
    main_price: string;
    category_id: number;
  }>;
  free_items: Array<{
    id: number;
    quantity: number;
    name: string;
    main_price: string;
    category_id: number;
  }>;
  user_id: number | null;
  guest_id: string | null;
  offer_price: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItemData[];
    bogo_offers: BogoOffer[];
    bogo_bundles: BogoBundle[];
    grand_total: number;
    item_count: number;
  };
}

// GET cart items
export function useCart() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const { setItemCount, clearCart } = useCartStore();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [bogoOffers, setBogoOffers] = useState<BogoOffer[]>([]);
  const [bogoBundles, setBogoBundles] = useState<BogoBundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [itemCount, setItemCountLocal] = useState(0);

  // Function to update cart item quantity locally
  const updateCartItemLocally = (cartItemId: number, newQuantity: number) => {
    setCartItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity: newQuantity, total_price: parseFloat(item.item.main_price) * newQuantity }
          : item
      );
      
      // Recalculate totals using the updated items
      const newGrandTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update local state
      setGrandTotal(newGrandTotal);
      setItemCountLocal(newItemCount);
      
      return updatedItems;
    });
  };

  // Function to remove cart item locally
  const removeCartItemLocally = (cartItemId: number) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== cartItemId);
      
      // Recalculate totals using the updated items
      const newGrandTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update local state
      setGrandTotal(newGrandTotal);
      setItemCountLocal(newItemCount);
      
      return updatedItems;
    });
  };

  // Update global store when itemCount changes
  useEffect(() => {
    setItemCount(itemCount);
  }, [itemCount, setItemCount]);

  // Function to clear the entire cart
  const clearCartItems = () => {
    setCartItems([]);
    setBogoOffers([]);
    setBogoBundles([]);
    setGrandTotal(0);
    setItemCountLocal(0);
    clearCart(); // Clear the global store as well
  };

  // Function to fetch BOGO offers for authenticated users
  const fetchUserBogoOffers = async () => {
    try {
      const response = await fetch(USER_BOGO_OFFERS_API, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching user BOGO offers:', error);
    }
    return { bogo_offers: [], bogo_bundles: [] };
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Fetch user cart
        const response = await fetch(USER_CART_API, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user cart');
        }
        
        const data: CartResponse = await response.json();
        
        
        if (data.success) {
          setCartItems(data.data.items);
          setBogoOffers(data.data.bogo_offers || []);
          setBogoBundles(data.data.bogo_bundles || []);
          setGrandTotal(data.data.grand_total);
          setItemCountLocal(data.data.item_count);
          setItemCount(data.data.item_count); // Update global store
          
          // If no BOGO data in cart response, try to fetch it separately
          if ((!data.data.bogo_offers || data.data.bogo_offers.length === 0) && 
              (!data.data.bogo_bundles || data.data.bogo_bundles.length === 0)) {
            const bogoData = await fetchUserBogoOffers();
            if (bogoData.bogo_offers) setBogoOffers(bogoData.bogo_offers);
            if (bogoData.bogo_bundles) setBogoBundles(bogoData.bogo_bundles);
          }
        } else {
          setCartItems([]);
          setBogoOffers([]);
          setBogoBundles([]);
          setGrandTotal(0);
          setItemCountLocal(0);
          setItemCount(0); // Update global store
        }
      } else {
        // Fetch guest cart
        if (!guestId) {
          setCartItems([]);
          setBogoOffers([]);
          setBogoBundles([]);
          setGrandTotal(0);
          setItemCountLocal(0);
          setItemCount(0); // Update global store
          return;
        }
        
        const response = await fetch(`${GUEST_CART_API}?guest_id=${guestId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch guest cart');
        }
        
        const data: CartResponse = await response.json();
        
        if (data.success) {
          setCartItems(data.data.items);
          setBogoOffers(data.data.bogo_offers || []);
          setBogoBundles(data.data.bogo_bundles || []);
          setGrandTotal(data.data.grand_total);
          setItemCountLocal(data.data.item_count);
          setItemCount(data.data.item_count); // Update global store
        } else {
          setCartItems([]);
          setBogoOffers([]);
          setBogoBundles([]);
          setGrandTotal(0);
          setItemCountLocal(0);
          setItemCount(0); // Update global store
        }
      }
    } catch (err: any) {
      setError(err.message);
      setCartItems([]);
      setBogoOffers([]);
      setBogoBundles([]);
      setGrandTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, guestId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { 
    cartItems, 
    bogoOffers,
    bogoBundles,
    loading, 
    error, 
    grandTotal, 
    itemCount: itemCount, 
    refetch: fetchCart,
    updateCartItemLocally,
    removeCartItemLocally,
    clearCartItems
  };
}

// UPDATE cart item quantity
export function useUpdateCartItem() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Update user cart item
        const response = await fetch(`${USER_CART_API}/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        return await response.json();
      } else {
        // Update guest cart item
        if (!guestId) {
          throw new Error('Guest ID not available');
        }
        
        const response = await fetch(`${GUEST_CART_API}/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            guest_id: guestId,
            quantity 
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        return await response.json();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCartItem, loading, error };
}

// DELETE cart item
export function useDeleteCartItem() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCartItem = async (cartItemId: number) => {
    setLoading(true);
    setError(null);

    try {
      
      if (isAuthenticated) {
        // Delete user cart item
        const response = await fetch(`${USER_CART_API}/${cartItemId}`, {
          method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete cart item');
        }
        
        return await response.json();
      } else {
        // Delete guest cart item using guest cart endpoint
        if (!guestId) {
          throw new Error('Guest ID is required');
        }
        
        const response = await fetch(`${GUEST_CART_API}/${cartItemId}?guest_id=${guestId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete guest cart item');
        }
        
        return await response.json();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCartItem, loading, error };
}

// DELETE guest cart item (dedicated hook for guest users)
export function useDeleteGuestCartItem() {
  const { guestId } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGuestCartItem = async (cartItemId: number) => {
    if (!guestId) {
      throw new Error('Guest ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GUEST_CART_API}/${cartItemId}?guest_id=${guestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete guest cart item');
      }
      
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGuestCartItem, loading, error };
}

// GET cart summary
export function useCartSummary() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const [summary, setSummary] = useState<{
    total_items: number;
    subtotal: number;
    delivery_fee: number;
    tax_amount: number;
    total_amount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartSummary = useCallback(async () => {
    if (!isAuthenticated && !guestId) {
      setError('User not authenticated and no guest ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (guestId) {
        params.append('guest_id', guestId);
      }

      const url = `${CART_SUMMARY_API}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch cart summary');
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, guestId]);

  return {
    summary,
    loading,
    error,
    fetchCartSummary,
  };
}
