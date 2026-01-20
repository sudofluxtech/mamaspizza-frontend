'use client';

import { useState, useEffect } from 'react';
import { Restaurant } from '@/hooks/restaurant.hook';
import { RESTAURANTS_API } from '@/app/api';

export default function PrivacyPolicyPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantsDirect = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(RESTAURANTS_API, {
        headers: {
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

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-10 mt-[200px]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-10 mt-[200px]">
        <div className="text-center text-red-500">
          <p>Error loading content: {error}</p>
        </div>
      </main>
    );
  }

  const restaurant = restaurants[0]; // Get the first restaurant

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-10 mt-[200px]">
      <h1 className="text-2xl font-semibold mb-3">Privacy Policy</h1>
      {restaurant?.privacy_policy ? (
        <div 
          className="text-foreground/70 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: restaurant.privacy_policy }}
        />
      ) : (
        <p className="text-foreground/70">No privacy policy content available at the moment.</p>
      )}
    </main>
  );
}