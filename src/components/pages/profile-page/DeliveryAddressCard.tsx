"use client";

import React from 'react';
import { MapPin, Edit3, Trash2, Home, Navigation } from 'lucide-react';
import { DeliveryAddress } from '@/hooks/delivery-address.hook';

interface DeliveryAddressCardProps {
  address: DeliveryAddress;
  onEdit?: (address: DeliveryAddress) => void;
  onDelete?: (address: DeliveryAddress) => void;
}

export default function DeliveryAddressCard({ 
  address, 
  onEdit, 
  onDelete 
}: DeliveryAddressCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Delivery Address</h3>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(address)}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                title="Edit Address"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(address)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors"
                title="Delete Address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Main Address */}
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
          
              <p className="text-gray-600">
                {address.address_line_1}
              </p>
              {address.address_line_2 && (
                <p className="text-gray-600">
                  {address.address_line_2}
                </p>
              )}
            </div>
          </div>

          {/* Post Code*/}
          <div className="flex items-start gap-3">
            <Navigation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-600">
                ZIP: {address.post_code}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          {address.details && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Additional Details:</span> {address.details}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Created: {new Date(address.created_at).toLocaleDateString()}
            </p>
            {address.updated_at !== address.created_at && (
              <p className="text-xs text-gray-500">
                Updated: {new Date(address.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

