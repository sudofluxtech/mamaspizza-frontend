"use client";

import { useAuth } from "@/lib/stores/useAuth";
import Link from "next/link";
import React from "react";

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

interface BogoBundle {
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

interface OrderSummaryProps {
  summary: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  onCheckout: () => void;
  isFormValid?: boolean;
  isLoading?: boolean;
  bogoBundles?: BogoBundle[];
  bogoOffers?: BogoOffer[];
}

export default function OrderSummary({ summary, onCheckout, isFormValid = true, isLoading = false, bogoBundles = [] }: OrderSummaryProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8 sticky top-4 lg:top-[130px]">
      {/* Order Summary Card */}
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl sm:rounded-2xl shadow-xl border border-orange-100 ">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

        {/* Summary Details */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between text-base sm:text-lg text-gray-600">
            <span>Sub Total</span>
            <span className="font-semibold">{summary.subtotal.toFixed(0)} USD</span>
          </div>
          
          {/* BOGO Savings */}
          {bogoBundles.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between text-base sm:text-lg text-green-700">
                <span className="font-medium">BOGO Savings</span>
                <span className="font-semibold">
                  -${bogoBundles.reduce((total, bundle) => {
                    const originalPrice = bundle.buy_items.reduce((sum, item) => sum + parseFloat(item.main_price), 0) +
                                       bundle.free_items.reduce((sum, item) => sum + parseFloat(item.main_price), 0);
                    return total + (originalPrice - bundle.offer_price);
                  }, 0).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                You saved money with BOGO offers!
              </p>
            </div>
          )}
          
          <div className="flex justify-between text-base sm:text-lg text-gray-600">
            <span>Discount</span>
            <span className="text-gray-600 font-semibold">{summary.discount.toFixed(0)} USD</span>
          </div>

          <div className="border-t-2 border-orange-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900">
              <span>Subtotal</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              * Delivery fee and taxes will be calculated at checkout
            </p>
          </div>
        </div>

        
        {
          user && !user.delivery_address && (
            <div className="p-3 sm:p-4 mt-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl border border-orange-200">
              <p>Please add a delivery address to your profile</p>
              <Link href="/profile" className="text-orange-600 hover:underline font-semibold">
                Add Address
              </Link>
            </div>
          )
        }
        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          // (user && user.delivery_address === null ? true : false)
          disabled={!isFormValid || isLoading }
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-orange-600 to-red-500 text-white py-2.5 sm:py-4 px-4 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-base sm:text-xl hover:from-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isLoading ? "Processing..." : "Checkout Now"}
            </div>
          ) : (
            "Checkout Now"
          )}
        </button>
      </div>

    </div>
  );
}
