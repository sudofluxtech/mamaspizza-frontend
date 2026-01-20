"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Gift, ShoppingCart } from "lucide-react";

interface OfferItem {
  id: number;
  quantity: number;
  name: string;
  main_price: string;
  category_id: number;
  thumbnail?: string;
}

interface BogoBundle {
  bogo_offer_id: number;
  buy_items: OfferItem[];
  free_items: OfferItem[];
  user_id: number | null;
  guest_id: string | null;
  offer_price: number;
}

interface BogoOffer {
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

interface OfferGroupCardProps {
  bundle: BogoBundle;
  offer: BogoOffer;
  onRemoveBundle: (bundleId: string) => void;
  isLoading?: boolean;
  loadingItems?: Set<number>;
}

const OfferGroupCard: React.FC<OfferGroupCardProps> = ({
  bundle,
  offer,
  onRemoveBundle,
  isLoading = false,
  // loadingItems = new Set() // Currently unused
}) => {
  const bundleId = `${bundle.bogo_offer_id}-${
    bundle.user_id || bundle.guest_id
  }`;

  // Check if any items in this bundle are currently being removed
  // Note: We need to check against the actual cart item IDs, not the menu item IDs
  const isBundleLoading = isLoading;

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-800">{offer.title}</h3>
            <p className="text-sm text-green-600">Special Offer</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-600">
            ${bundle.offer_price.toFixed(2)}
          </div>
          <button
            onClick={() => onRemoveBundle(bundleId)}
            disabled={isBundleLoading}
            className="mt-1 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove offer"
          >
            {isBundleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buy Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-semibold text-gray-700">
              Items to Buy
            </h4>
          </div>
          <div className="space-y-2">
            {bundle.buy_items.map((item, index) => (
              <div
                key={`buy-${item.id}-${index}`}
                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-orange-100"
              >
                {item.thumbnail && (
                  <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/public/${item.thumbnail}`}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-orange-600">
                  ${parseFloat(item.main_price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Free Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-semibold text-gray-700">Free Items</h4>
          </div>
          <div className="space-y-2">
            {bundle.free_items.map((item, index) => (
              <div
                key={`free-${item.id}-${index}`}
                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-100"
              >
                {item.thumbnail && (
                  <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/public/${item.thumbnail}`}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-green-600">
                  FREE
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Badge */}
      <div className="mt-4 pt-3 border-t border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">You Save</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            $
            {(
              bundle.buy_items.reduce(
                (sum, item) =>
                  sum + parseFloat(item.main_price) * item.quantity,
                0
              ) +
              bundle.free_items.reduce(
                (sum, item) =>
                  sum + parseFloat(item.main_price) * item.quantity,
                0
              ) -
              bundle.offer_price
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfferGroupCard;
