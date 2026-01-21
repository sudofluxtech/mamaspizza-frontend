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

// Module-level cache to prevent duplicate API calls across all hook instances
let globalCartFetchPromise: Promise<void> | null = null;
let globalCartFetchKey: string = '';
let globalCartData: {
  cartItems: CartItemData[];
  bogoOffers: BogoOffer[];
  bogoBundles: BogoBundle[];
  grandTotal: number;
  itemCount: number;
} | null = null;
const globalCartSubscribers: Set<(data: typeof globalCartData) => void> = new Set();

// GET cart items
export function useCart() {
  const { token, isAuthenticated } = useAuth();
  const { guestId } = useGuest();
  const { setItemCount, clearCart } = useCartStore();
  const [cartItems, setCartItems] = useState<CartItemData[]>(globalCartData?.cartItems || []);
  const [bogoOffers, setBogoOffers] = useState<BogoOffer[]>(globalCartData?.bogoOffers || []);
  const [bogoBundles, setBogoBundles] = useState<BogoBundle[]>(globalCartData?.bogoBundles || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState(globalCartData?.grandTotal || 0);
  const [itemCount, setItemCountLocal] = useState(globalCartData?.itemCount || 0);
  
  // Subscribe to global cart updates
  useEffect(() => {
    const updateState = (data: typeof globalCartData) => {
      if (data) {
        setCartItems(data.cartItems);
        setBogoOffers(data.bogoOffers);
        setBogoBundles(data.bogoBundles);
        setGrandTotal(data.grandTotal);
        setItemCountLocal(data.itemCount);
      }
    };
    
    globalCartSubscribers.add(updateState);
    
    // If we already have cached data, use it
    if (globalCartData) {
      updateState(globalCartData);
    }
    
    return () => {
      globalCartSubscribers.delete(updateState);
    };
  }, []);

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
    // Clear global cache when cart is cleared
    globalCartData = null;
    globalCartSubscribers.forEach(subscriber => subscriber(null));
  };

  const fetchCart = useCallback(async () => {
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
    // Create a unique key for this fetch based on auth state
    const fetchKey = `${isAuthenticated ? 'user' : 'guest'}_${isAuthenticated ? token : guestId}`;
    
    // If there's already a fetch in progress with the same key, wait for it
    if (globalCartFetchPromise && globalCartFetchKey === fetchKey) {
      await globalCartFetchPromise;
      return;
    }
    
    // If already fetching with different params, wait for it to complete first
    if (globalCartFetchPromise) {
      await globalCartFetchPromise;
      // After waiting, check if we still need to fetch (params might have changed)
      if (globalCartFetchKey === fetchKey && globalCartData) {
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    // Create and store the fetch promise
    globalCartFetchKey = fetchKey;
    globalCartFetchPromise = (async () => {

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
            const cartData = {
              cartItems: data.data.items,
              bogoOffers: data.data.bogo_offers || [],
              bogoBundles: data.data.bogo_bundles || [],
              grandTotal: data.data.grand_total,
              itemCount: data.data.item_count,
            };
            
            // Update global cache
            globalCartData = cartData;
            
            // Update all subscribers
            globalCartSubscribers.forEach(subscriber => subscriber(cartData));
            
            setItemCount(data.data.item_count); // Update global store
            
            // If no BOGO data in cart response, try to fetch it separately
            if ((!data.data.bogo_offers || data.data.bogo_offers.length === 0) && 
                (!data.data.bogo_bundles || data.data.bogo_bundles.length === 0)) {
              const bogoData = await fetchUserBogoOffers();
              if (bogoData.bogo_offers || bogoData.bogo_bundles) {
                const updatedData = {
                  ...cartData,
                  bogoOffers: bogoData.bogo_offers || cartData.bogoOffers,
                  bogoBundles: bogoData.bogo_bundles || cartData.bogoBundles,
                };
                globalCartData = updatedData;
                globalCartSubscribers.forEach(subscriber => subscriber(updatedData));
              }
            }
          } else {
            const emptyData = {
              cartItems: [],
              bogoOffers: [],
              bogoBundles: [],
              grandTotal: 0,
              itemCount: 0,
            };
            globalCartData = emptyData;
            globalCartSubscribers.forEach(subscriber => subscriber(emptyData));
            setItemCount(0); // Update global store
          }
        } else {
          // Fetch guest cart
          if (!guestId) {
            const emptyData = {
              cartItems: [],
              bogoOffers: [],
              bogoBundles: [],
              grandTotal: 0,
              itemCount: 0,
            };
            globalCartData = emptyData;
            globalCartSubscribers.forEach(subscriber => subscriber(emptyData));
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
            const cartData = {
              cartItems: data.data.items,
              bogoOffers: data.data.bogo_offers || [],
              bogoBundles: data.data.bogo_bundles || [],
              grandTotal: data.data.grand_total,
              itemCount: data.data.item_count,
            };
            globalCartData = cartData;
            globalCartSubscribers.forEach(subscriber => subscriber(cartData));
            setItemCount(data.data.item_count); // Update global store
          } else {
            const emptyData = {
              cartItems: [],
              bogoOffers: [],
              bogoBundles: [],
              grandTotal: 0,
              itemCount: 0,
            };
            globalCartData = emptyData;
            globalCartSubscribers.forEach(subscriber => subscriber(emptyData));
            setItemCount(0); // Update global store
          }
        }
      } catch (err: any) {
        setError(err.message);
        const emptyData = {
          cartItems: [],
          bogoOffers: [],
          bogoBundles: [],
          grandTotal: 0,
          itemCount: 0,
        };
        globalCartData = emptyData;
        globalCartSubscribers.forEach(subscriber => subscriber(emptyData));
        setItemCount(0);
      } finally {
        setLoading(false);
        globalCartFetchPromise = null;
      }
    })();
    
    await globalCartFetchPromise;
  }, [isAuthenticated, token, guestId, setItemCount]);

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
