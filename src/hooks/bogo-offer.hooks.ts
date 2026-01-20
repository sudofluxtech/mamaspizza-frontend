"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { ADMIN_OFFERS_API } from "@/app/api";

export type Category = {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

export type Size = {
  id: number;
  size: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

export type BogoOffer = {
  id: number;
  title: string;
  description: string;
  buy_quantity: number;
  get_quantity: number;
  offer_price: string;
  category_id: number | null;
  item_ids: number[] | null;
  is_active: boolean;
  thumbnail: string | null;
  terms_conditions: string;
  created_at: string;
  updated_at: string;
  size_id: number | null;
  category: Category | null;
  size: Size | null;
};

export type BogoOffersResponse = {
  success: boolean;
  message: string;
  data: BogoOffer[];
};

// GET bogo offers (public - no authentication required)
export function useBogoOffers() {
  const [bogoOffers, setBogoOffers] = useState<BogoOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBogoOffers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try the admin endpoint first (might work without auth for public offers)
      const response = await fetch(ADMIN_OFFERS_API, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const responseData: BogoOffersResponse = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setBogoOffers(responseData.data);
      } else {
        console.warn(
          "BOGO Offers API returned unsuccessful response:",
          responseData
        );
        setBogoOffers([]);
      }
    } catch (err: any) {
      console.error("Error fetching BOGO offers:", err);
      setError(err.message);
      setBogoOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBogoOffers();
  }, [fetchBogoOffers]);

  return { bogoOffers, loading, error, refetch: fetchBogoOffers };
}

// CREATE BogoOffer
export function useCreateBogoOffer() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBogoOffer = async (bogoOfferData: Partial<BogoOffer>) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ADMIN_OFFERS_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(bogoOfferData),
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

  return { createBogoOffer, loading, error };
}

// UPDATE BogoOffer
export function useUpdateBogoOffer() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBogoOffer = async (
    id: number,
    bogoOfferData: Partial<BogoOffer>
  ) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ADMIN_OFFERS_API}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(bogoOfferData),
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

  return { updateBogoOffer, loading, error };
}

// DELETE BogoOffer
export function useDeleteBogoOffer() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBogoOffer = async (id: number) => {
    if (!token) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ADMIN_OFFERS_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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

  return { deleteBogoOffer, loading, error };
}
