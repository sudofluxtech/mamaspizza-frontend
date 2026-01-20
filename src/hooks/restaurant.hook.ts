"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { RESTAURANTS_API, getRestaurantById } from "@/app/api";

export interface Restaurant {
  id: number;
  privacy_policy: string | null;
  terms: string | null;
  refund_process: string | null;
  license: string | null;
  isShopOpen: boolean;
  shop_name: string;
  shop_address: string;
  shop_details: string;
  created_at: string;
  updated_at: string;
  user_info?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface CreateRestaurantData {
  user_id: number;
  privacy_policy: string;
  terms: string;
  refund_process: string;
  license: string;
  isShopOpen: boolean;
  shop_name: string;
  shop_address: string;
  shop_details: string;
}

export interface UpdateRestaurantData {
  privacy_policy?: string;
  terms?: string;
  refund_process?: string;
  license?: string;
  isShopOpen?: boolean;
  shop_name?: string;
  shop_address?: string;
  shop_details?: string;
}

// GET all restaurants
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(RESTAURANTS_API, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const result = await response.json();
      setRestaurants(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
  };
}

// GET restaurant by ID
export function useRestaurant(restaurantId: string) {
  const { token, isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getRestaurantById(restaurantId), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant");
      }

      const result = await response.json();
      setRestaurant(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, restaurantId]);

  return {
    restaurant,
    loading,
    error,
    fetchRestaurant,
  };
}

// CREATE restaurant
export function useCreateRestaurant() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRestaurant = async (restaurantData: CreateRestaurantData) => {
    if (!isAuthenticated || !token) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(RESTAURANTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(restaurantData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Bubble up validation errors when available
        if (response.status === 422) {
          throw new Error(
            errorData.message || "Validation error while creating restaurant"
          );
        }
        throw new Error(errorData.message || "Failed to create restaurant");
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
    createRestaurant,
    loading,
    error,
  };
}

// UPDATE restaurant
export function useUpdateRestaurant() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRestaurant = async (
    restaurantId: number,
    restaurantData: UpdateRestaurantData
  ) => {
    if (!isAuthenticated || !token) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getRestaurantById(restaurantId.toString()), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(restaurantData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(errorData.message || "Restaurant not found");
        }
        if (response.status === 422) {
          throw new Error(
            errorData.message || "Validation error while updating restaurant"
          );
        }
        throw new Error(errorData.message || "Failed to update restaurant");
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
    updateRestaurant,
    loading,
    error,
  };
}

// DELETE restaurant
export function useDeleteRestaurant() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRestaurant = async (restaurantId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getRestaurantById(restaurantId.toString()), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(errorData.message || "Restaurant not found");
        }
        throw new Error(errorData.message || "Failed to delete restaurant");
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
    deleteRestaurant,
    loading,
    error,
  };
}
