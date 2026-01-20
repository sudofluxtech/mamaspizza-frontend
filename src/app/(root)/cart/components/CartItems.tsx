"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  description: string;
  color: string;
}

interface CartItemsProps {
  cart: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  loadingItems?: Set<number>;
  quantityInputs?: { [key: number]: string };
  onQuantityInputChange?: (id: number, value: string) => void;
  onQuantityInputBlur?: (id: number) => void;
}

export default function CartItems({ 
  cart, 
  onUpdateQty, 
  onRemoveItem, 
  loadingItems = new Set(),
  quantityInputs = {},
  onQuantityInputChange,
  onQuantityInputBlur
}: CartItemsProps) {
  if (cart.length === 0) {

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-xl border border-orange-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Your cart is empty</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">Add some delicious food to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden sm:block px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="grid grid-cols-12 gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-orange-800 uppercase tracking-wide">
          <div className="col-span-4">Food Items</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-3 text-right">Total</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-orange-100">
        {cart.map((item) => (
          <div key={item.id} className="p-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-orange-50/50 transition-colors duration-300">
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 rounded-md sm:rounded-lg flex-shrink-0 shadow-md">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-300 hover:scale-110" 
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{item.name} </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{item.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 border-2 border-orange-200 rounded-md sm:rounded-lg px-1.5 sm:px-3 py-1 sm:py-1.5 bg-white shadow-sm">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    disabled={loadingItems.has(item.id)}
                    className="w-5 h-5 sm:w-7 sm:h-7 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    {loadingItems.has(item.id) ? (
                      <div className="w-2.5 h-2.5 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      <Minus size={12} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.qty}
                    onChange={(e) => onQuantityInputChange?.(item.id, e.target.value)}
                    onBlur={() => onQuantityInputBlur?.(item.id)}
                    className="min-w-5 sm:min-w-8 max-w-[80px] text-center font-semibold text-xs sm:text-base text-gray-900 bg-transparent border-none outline-none"
                    disabled={loadingItems.has(item.id)}
                  />
                  <button
                    onClick={() => onUpdateQty(item.id, +1)}
                    disabled={loadingItems.has(item.id)}
                    className="w-5 h-5 sm:w-7 sm:h-7 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    {loadingItems.has(item.id) ? (
                      <div className="w-2.5 h-2.5 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      <Plus size={12} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    disabled={loadingItems.has(item.id)}
                    className="p-1 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md sm:rounded-lg transition-all duration-300 group/remove disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove item"
                  >
                    {loadingItems.has(item.id) ? (
                      <div className="w-3 h-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={14} className="sm:w-5 sm:h-5 group-hover/remove:scale-110" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Food Items Column */}
              <div className="col-span-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 rounded-md sm:rounded-lg flex-shrink-0 shadow-md">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-110" 
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{item.description}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Column */}
              <div className="col-span-3 flex justify-center">
                <div className="flex items-center gap-1 border-2 border-orange-200 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 bg-white shadow-sm">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    disabled={loadingItems.has(item.id)}
                    className="w-6 h-6 sm:w-7 sm:h-7 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    {loadingItems.has(item.id) ? (
                      <div className="w-3 h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      <Minus size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.qty}
                    onChange={(e) => onQuantityInputChange?.(item.id, e.target.value)}
                    onBlur={() => onQuantityInputBlur?.(item.id)}
                    className="min-w-6 sm:min-w-8 max-w-[100px] text-center font-bold text-sm sm:text-base text-gray-900 bg-transparent border-none outline-none"
                    disabled={loadingItems.has(item.id)}
                  />
                  <button
                    onClick={() => onUpdateQty(item.id, +1)}
                    disabled={loadingItems.has(item.id)}
                    className="w-6 h-6 sm:w-7 sm:h-7 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    {loadingItems.has(item.id) ? (
                      <div className="w-3 h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Total Column */}
              <div className="col-span-3 text-right">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>

              {/* Action Column */}
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  disabled={loadingItems.has(item.id)}
                  className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 group/remove disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove item"
                >
                  {loadingItems.has(item.id) ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={16} className="sm:w-5 sm:h-5 group-hover/remove:scale-110" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
