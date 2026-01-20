import React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { BogoOffer } from "@/hooks/bogo-offer.hooks";
import { useCart } from "@/hooks/cart.hook";
import { useOrderStore } from "@/lib/stores/orderStore";
import { API_BASE_URL } from "@/app/api";
import OfferDialogBox from "./OfferDialogBox";

interface MenuOfferCardsProps {
  offer: BogoOffer;
  isModalOpen?: boolean;
  onModalOpen?: (offerId: number) => void;
  isLoading?: boolean;
}

const MenuOfferCards: React.FC<MenuOfferCardsProps> = ({
  offer,
  isModalOpen = false,
  onModalOpen,
  isLoading = false,
}) => {
  const { bogoOffers, bogoBundles } = useCart();
  const { canOrder } = useOrderStore();

  // Check if any offer is already in the cart
  const hasOfferInCart = bogoOffers.length > 0 || bogoBundles.length > 0;

  // Check if this specific offer is in the cart
  // const isThisOfferInCart = bogoOffers.some(bogoOffer => bogoOffer.id === offer.id) ||
  //                          bogoBundles.some(bundle => bundle.bogo_offer_id === offer.id);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't open modal if disabled
    if (!canOrder || hasOfferInCart || isLoading || isModalOpen) {
      return;
    }

    if (onModalOpen) {
      onModalOpen(offer.id);
    }
  };

  const isDisabled = !canOrder || hasOfferInCart || isLoading || isModalOpen;

  return (
    <div
      key={offer.id}
      onClick={handleCardClick}
      className={`bg-white border-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group h-full flex flex-col ${
        isDisabled
          ? " cursor-not-allowed border-gray-200"
          : "cursor-pointer border-orange-100 hover:shadow-2xl hover:border-orange-200"
      }`}
    >
      {offer.thumbnail && (
        <div className="relative overflow-hidden">
          <Image
            src={`${API_BASE_URL}/public/${offer.thumbnail}`}
            alt={offer.title}
            width={320}
            height={160}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {offer.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {offer.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-center">
          {isLoading ? (
            <span className="inline-flex items-center bg-gray-400 text-white px-6 py-2 rounded-xl font-bold text-lg tracking-wide">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading...</span>
            </span>
          ) : !canOrder ? (
            <span className="inline-flex items-center bg-gray-400 text-white py-2 px-2 rounded-xl font-bold  tracking-wide">
              <span>Delivery Not Available</span>
            </span>
          ) : hasOfferInCart ? (
            <span className="inline-flex items-center bg-gray-400 text-white px-6 py-2 rounded-xl font-bold text-lg tracking-wide">
              <svg
                width="20"
                height="20"
                fill="none"
                className="mr-2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-lg">Offer Already in Cart</span>
            </span>
          ) : (
            <span className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <svg
                width="20"
                height="20"
                fill="none"
                className="mr-2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="11" fill="#fff" />
                <path
                  d="M7.5 13.5C7.77 14.98 9.18 16 12 16C14.82 16 16.23 14.98 16.5 13.5"
                  stroke="#ea580c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <g>
                  <ellipse cx="9" cy="11" rx="1" ry="1.5" fill="#ea580c" />
                  <ellipse cx="15" cy="11" rx="1" ry="1.5" fill="#ea580c" />
                </g>
              </svg>
              <span className="text-lg">View Offer</span>
            </span>
          )}
        </div>
      </div>
      <OfferDialogBox
        offer={offer}
        open={isModalOpen}
        setOpen={(open) => !open && onModalOpen?.(0)}
      />
    </div>
  );
};

export default MenuOfferCards;
