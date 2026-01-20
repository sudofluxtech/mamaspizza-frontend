/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';
import type { Restaurant } from "@/hooks/restaurant.hook";
import { RESTAURANTS_API } from "@/app/api";
import ShopOpenForm from "./_components/ShopOpenForm"
import RestaurantForms from "./_components/RestaurantForms"
import { useAuth } from '@/lib/stores/useAuth';

const Settings = () => {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantsDirect = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(RESTAURANTS_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const result = await response.json();
      setRestaurants(result?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantsDirect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your restaurant settings and preferences</p>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {loading && (
        <div className="text-gray-600 text-sm">Loading restaurant...</div>
      )}

      {!loading && restaurants && restaurants.length > 0 && (
        <>
          <ShopOpenForm instance={restaurants[0]} onChanged={fetchRestaurantsDirect} />
          <RestaurantForms instance={restaurants[0]} onChanged={fetchRestaurantsDirect} />
        </>
      )}
    </div>
  )
}

export default Settings
