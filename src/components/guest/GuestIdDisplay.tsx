"use client";

import React from 'react';
import { useGuest } from '@/lib/guest/GuestProvider';

const GuestIdDisplay: React.FC = () => {
  const { guestId, isLoading } = useGuest();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">
        Loading guest ID...
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-mono">
      Guest ID: {guestId}
    </div>
  );
};

export default GuestIdDisplay;
