"use client";

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  MapPin,
  MessageSquare,
  ShoppingCart,
  ArrowRight,
  Utensils,
} from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
  useDeleteGuestCartItem,
} from "@/hooks/cart.hook";
import { useAuth } from "@/lib/stores/useAuth";
import { useCreateOrder } from "@/hooks/order.hook";
import { USER_ORDERS_API, USER_STRIPE_CREATE_SESSION_API } from "@/app/api";
import { useCreateGuestOrder } from "@/hooks/guest-order.hook";
import { useCreateGuestStripeSession } from "@/hooks/guest-payment.hook";
import { usePaymentWorkflow } from "@/hooks/stripe-payment.hook";
import { useGuest } from "@/lib/guest/GuestProvider";
import { toast } from "sonner";
import OrderSummary from "./components/OrderSummary";
import OfferGroupCard from "@/components/pages/cart-page/OfferGroupCard";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   qty: number;
//   description: string;
//   color: string;
// }

export interface GuestOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    post_code: string;
    details?: string;
  };
  special_instructions: string;
}

interface GuestOrderFormErrors {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: {
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    post_code?: string;
    details?: string;
  };
  special_instructions?: string;
}

export default function CartPage() {
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: number]: string;
  }>({});

  // Guest form state
  const [guestFormData, setGuestFormData] = useState<GuestOrderData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: {
      address_line_1: "",
      address_line_2: "",
      city: "",
      post_code: "",
      details: "",
    },
    special_instructions: "",
  });
  const [guestFormErrors, setGuestFormErrors] = useState<GuestOrderFormErrors>(
    {}
  );

  // Authenticated user form state
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [authFormData, setAuthFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: {
      address_line_1: "",
      address_line_2: "",
      city: "",
      post_code: "",
      details: "",
    },
  });

  // Auth hook
  const { isAuthenticated, user, token } = useAuth();
  const { guestId } = useGuest();

  // Populate authenticated user form with their data
  useEffect(() => {
    if (isAuthenticated && user) {
    

      setAuthFormData({
        customer_name: user.name || "",
        customer_phone: user.phone || "",
        customer_email: user.email || "",
        delivery_address: {
          address_line_1: user.delivery_address?.address_line_1 || "",
          address_line_2: user.delivery_address?.address_line_2 || "",
          city: user.delivery_address?.city || "",
          post_code: user.delivery_address?.post_code || "",
          details: user.delivery_address?.details || "",
        },
      });
    }
  }, [isAuthenticated, user, user?.delivery_address]);

  // Cart hooks
  const {
    cartItems,
    bogoOffers,
    bogoBundles,
    loading,
    error,
    grandTotal,
    refetch,
    updateCartItemLocally,
    removeCartItemLocally,
    clearCartItems,
  } = useCart();
  const { updateCartItem } = useUpdateCartItem();
  const { deleteCartItem } = useDeleteCartItem();
  const { deleteGuestCartItem } = useDeleteGuestCartItem();

  // Order creation hooks
  const { loading: createOrderLoading } = useCreateOrder();
  const { createGuestOrder, loading: createGuestOrderLoading } =
    useCreateGuestOrder();
  const { createSession, loading: createSessionLoading } =
    useCreateGuestStripeSession();
  const { loading: paymentLoading } = usePaymentWorkflow();

  // Separate regular items from BOGO items and create BOGO bundles
  const { regularItems, processedBogoBundles } = useMemo(() => {
    const regular: any[] = [];
    const bogo: any[] = [];
    const bundles: any[] = [];

    // Group BOGO items by offer_id
    const bogoGroups: { [key: number]: any[] } = {};

    cartItems.forEach((item) => {
      const itemData = {
        id: item.id,
        name: item.item.name,
        price:
          item.is_bogo_item && item.bogo_price
            ? parseFloat(item.bogo_price)
            : parseFloat(item.item.main_price),
        image: `${process.env.NEXT_PUBLIC_API_URL}/public/${item.item.thumbnail}`,
        qty: item.quantity,
        description: item.item.details,
        color: item.item.category.name,
        isBogoItem: item.is_bogo_item,
        bogoOfferId: item.bogo_offer_id,
        originalPrice: parseFloat(item.item.main_price),
        // Add raw item data for bundle creation
        rawItem: item,
      };

      if (item.is_bogo_item && item.bogo_offer_id) {
        bogo.push(itemData);

        // Group by bogo_offer_id
        if (!bogoGroups[item.bogo_offer_id]) {
          bogoGroups[item.bogo_offer_id] = [];
        }
        bogoGroups[item.bogo_offer_id].push(item);
      } else {
        regular.push(itemData);
      }
    });

    // Create BOGO bundles from grouped items
    Object.keys(bogoGroups).forEach((offerId) => {
      const items = bogoGroups[parseInt(offerId)];
      const offer = bogoOffers.find((o) => o.id === parseInt(offerId));

      if (offer && items.length > 0) {
        // Separate buy items and free items based on bogo_price
        const buyItems = items.filter(
          (item) => !item.bogo_price || parseFloat(item.bogo_price) > 0
        );
        const freeItems = items.filter(
          (item) => item.bogo_price && parseFloat(item.bogo_price) === 0
        );

        // Calculate offer price (sum of buy items)
        const offerPrice = buyItems.reduce(
          (sum, item) => sum + parseFloat(item.item.main_price),
          0
        );

        const bundle = {
          bogo_offer_id: parseInt(offerId),
          buy_items: buyItems.map((item) => ({
            id: item.item_id,
            quantity: item.quantity,
            name: item.item.name,
            main_price: item.item.main_price,
            category_id: item.item.category_id,
            thumbnail: item.item.thumbnail,
          })),
          free_items: freeItems.map((item) => ({
            id: item.item_id,
            quantity: item.quantity,
            name: item.item.name,
            main_price: item.item.main_price,
            category_id: item.item.category_id,
            thumbnail: item.item.thumbnail,
          })),
          user_id: items[0].user_id,
          guest_id: items[0].guest_id,
          offer_price: offerPrice,
        };

        bundles.push(bundle);
      }
    });

    return {
      regularItems: regular,
      bogoItems: bogo,
      processedBogoBundles: bundles,
    };
  }, [cartItems, bogoOffers]);

  const summary = useMemo(() => {
    const subtotal = grandTotal;
    const discount = 0; // No discount applied
    const delivery = 0; // Delivery fee will be calculated by backend
    const total = subtotal - discount + delivery;
    return { subtotal, discount, delivery, total };
  }, [grandTotal]);

  // Authenticated user form handlers
  const handleAuthInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setAuthFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setAuthFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Guest form handlers
  const handleGuestInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setGuestFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof GuestOrderData] as any),
          [child]: value,
        },
      }));
    } else {
      setGuestFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (guestFormErrors[field as keyof GuestOrderData]) {
      setGuestFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateGuestForm = (): boolean => {
    const newErrors: GuestOrderFormErrors = {};

    if (!guestFormData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!guestFormData.customer_phone.trim()) {
      newErrors.customer_phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(guestFormData.customer_phone)) {
      newErrors.customer_phone = "Please enter a valid phone number";
    }

    if (!guestFormData.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestFormData.customer_email)
    ) {
      newErrors.customer_email = "Please enter a valid email address";
    }

    if (!guestFormData.delivery_address.address_line_1.trim()) {
      newErrors.delivery_address = {
        ...newErrors.delivery_address,
        address_line_1: "Address line 1 is required",
      };
    }

    if (!guestFormData.delivery_address.city.trim()) {
      newErrors.delivery_address = {
        ...newErrors.delivery_address,
        city: "City is required",
      };
    }

    if (!guestFormData.delivery_address.post_code.trim()) {
      newErrors.delivery_address = {
        ...newErrors.delivery_address,
        post_code: "Post Code is required",
      };
    }

    setGuestFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isGuestFormValid = useMemo(() => {
    if (isAuthenticated) return true;
    return Boolean(
      guestFormData.customer_name.trim() &&
        guestFormData.customer_phone.trim() &&
        guestFormData.customer_email.trim() &&
        guestFormData.delivery_address.address_line_1.trim() &&
        guestFormData.delivery_address.city.trim() &&
        guestFormData.delivery_address.post_code.trim()
    );
  }, [isAuthenticated, guestFormData]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced update function
  const debouncedUpdateQty = useCallback(
    (cartItemId: number, newQuantity: number) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(async () => {
        try {
          // Set loading state
          setLoadingItems((prev) => new Set(prev).add(cartItemId));

          // Update UI immediately for better UX
          updateCartItemLocally(cartItemId, newQuantity);

          // Make API call
          await updateCartItem(cartItemId, newQuantity);

          toast.success("Cart updated successfully");
        } catch (error) {
          console.error("Error updating cart item:", error);
          // Revert the local change if API call fails
          const currentItem = cartItems.find((item) => item.id === cartItemId);
          if (currentItem) {
            updateCartItemLocally(cartItemId, currentItem.quantity);
          }
          toast.error("Failed to update cart item");
        } finally {
          // Remove loading state
          setLoadingItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(cartItemId);
            return newSet;
          });
        }
      }, 1000);
    },
    [cartItems, updateCartItemLocally, updateCartItem]
  );

  const updateQty = (cartItemId: number, delta: number) => {
    const currentItem = cartItems.find((item) => item.id === cartItemId);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);
    debouncedUpdateQty(cartItemId, newQuantity);
  };

  const handleQuantityInputChange = (cartItemId: number, value: string) => {
    setQuantityInputs((prev) => ({ ...prev, [cartItemId]: value }));
  };

  const handleQuantityInputBlur = (cartItemId: number) => {
    const inputValue = quantityInputs[cartItemId];
    if (inputValue) {
      const newQuantity = Math.max(1, parseInt(inputValue) || 1);
      debouncedUpdateQty(cartItemId, newQuantity);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const removeItem = async (cartItemId: number) => {
    try {
      // Set loading state
      setLoadingItems((prev) => new Set(prev).add(cartItemId));

      // Update UI immediately for better UX
      removeCartItemLocally(cartItemId);

      // Make API call based on authentication status
      if (isAuthenticated) {
        await deleteCartItem(cartItemId);
      } else {
        await deleteGuestCartItem(cartItemId);
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Revert the local change if API call fails - refetch to restore original state
      await refetch();
      toast.error("Failed to remove item from cart");
    } finally {
      // Remove loading state
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const removeBogoBundle = async (bundleId: string) => {
    try {
      // Find all BOGO items for this bundle and remove them
      const bundleOfferId = parseInt(bundleId.split("-")[0]);

      // First, try to find items in cartItems with is_bogo_item and bogo_offer_id
      let bogoItemsToRemove = cartItems.filter(
        (item) => item.is_bogo_item && item.bogo_offer_id === bundleOfferId
      );

      // If no items found in cartItems, check if we need to remove items from bogoBundles
      if (bogoItemsToRemove.length === 0) {
        // Check if this is a bundle from the API (bogoBundles)
        const bundleFromAPI = bogoBundles.find(
          (bundle) => bundle.bogo_offer_id === bundleOfferId
        );

        if (bundleFromAPI) {
          // For API bundles, we need to remove the individual items that make up this bundle
          // Find cart items that match the bundle's buy_items and free_items
          const allBundleItemIds = [
            ...bundleFromAPI.buy_items.map((item) => item.id),
            ...bundleFromAPI.free_items.map((item) => item.id),
          ];

          bogoItemsToRemove = cartItems.filter((item) =>
            allBundleItemIds.includes(item.item_id)
          );
        }
      }

      if (bogoItemsToRemove.length === 0) {
        toast.error("No BOGO items found to remove");
        return;
      }

      // Set loading state for all items in the bundle
      const itemIds = bogoItemsToRemove.map((item) => item.id);
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        itemIds.forEach((id) => newSet.add(id));
        return newSet;
      });

      // Remove all BOGO items for this bundle locally first
      bogoItemsToRemove.forEach((item) => {
        removeCartItemLocally(item.id);
      });

      // Make API calls for all items
      const deletePromises = bogoItemsToRemove.map(async (item) => {
        if (isAuthenticated) {
          return deleteCartItem(item.id);
        } else {
          return deleteGuestCartItem(item.id);
        }
      });

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      toast.success("BOGO offer removed from cart");
    } catch (error) {
      console.error("Error removing BOGO bundle:", error);
      // Refetch to restore original state
      await refetch();
      toast.error("Failed to remove BOGO offer");
    } finally {
      // Clear loading state for all items
      setLoadingItems(new Set());
    }
  };

  const handleCheckout = async () => {
    // Validate guest form if not authenticated
    if (!isAuthenticated && !validateGuestForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isAuthenticated) {
        // Validate required user information
        if (!user?.name || !user?.email) {
          toast.error(
            "User profile information is incomplete. Please update your profile."
          );
          return;
        }

        // Create order for authenticated user using USER_ORDERS_API
        const orderData = {
          // Customer information (required by API)
          customer_name: authFormData.customer_name,
          customer_phone: authFormData.customer_phone,
          customer_email: authFormData.customer_email,

          // Order details
          delivery_type: "delivery" as const,
          payment_method: "stripe" as const,
          special_instructions: specialInstructions,

          // Pricing details
          tax_rate: 0,
          delivery_fee: 0,
          discount_amount: 0,
          subtotal: grandTotal,
          tax_amount: 0,
          total_amount: grandTotal,

          // Delivery address - use form data
          delivery_address: {
            address_line_1: authFormData.delivery_address.address_line_1,
            address_line_2: authFormData.delivery_address.address_line_2 || "",
            city: authFormData.delivery_address.city || "",
            post_code: authFormData.delivery_address.post_code,
            details: authFormData.delivery_address.details || "",
          },
        };

        // Make API call to USER_ORDERS_API
        const response = await fetch(USER_ORDERS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create order");
        }
        toast.success("Order created successfully!");

        // Clear the cart after successful order creation
        clearCartItems();

        // Create Stripe payment session for authenticated user
        try {
          const orderId = result.data.order.id;

          if (!orderId) {
            throw new Error("Order ID not found in response");
          }

          const paymentResponse = await fetch(USER_STRIPE_CREATE_SESSION_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: orderId,
            }),
          });

          const paymentResult = await paymentResponse.json();

          if (!paymentResponse.ok || !paymentResult.success) {
            throw new Error(
              paymentResult.message || "Failed to create payment session"
            );
          }
          if (paymentResult.data.session_url) {
            toast.success("Redirecting to payment...");
            // Navigate to Stripe checkout session
            window.location.href = paymentResult.data.session_url;
          } else {
            toast.error("Payment session creation failed");
          }
        } catch (paymentError: any) {
          console.error("Error creating payment session:", paymentError);
          toast.error(
            paymentError.message || "Failed to create payment session"
          );
        }
      } else {
        // Create order for guest user
        if (!guestId) {
          toast.error("Guest ID not found. Please refresh and try again.");
          return;
        }

        const guestOrderData = {
          guest_id: guestId,
          delivery_type: "delivery" as const,
          customer_name: guestFormData.customer_name,
          customer_phone: guestFormData.customer_phone,
          customer_email: guestFormData.customer_email,
          delivery_address: {
            fields: "Delivery Address", // Default field name
            address_line_1: guestFormData.delivery_address.address_line_1,
            address_line_2: guestFormData.delivery_address.address_line_2,
            city: guestFormData.delivery_address.city,
            post_code: guestFormData.delivery_address.post_code,
            details: guestFormData.delivery_address.details,
          },
          special_instructions: guestFormData.special_instructions || "",
          payment_method: "stripe" as const,
          tax_rate: 0,
          delivery_fee: 0,
          discount_amount: 0,
        };

        const orderResult = await createGuestOrder(guestOrderData);
        toast.success("Order created successfully!");

        // Clear the cart after successful order creation
        clearCartItems();

        // Create payment session for guest order
        try {
          const paymentData: { order_id: number; guest_id: string } = {
            order_id: orderResult.id,
            guest_id: guestId,
          };

          const sessionResult = await createSession(paymentData);

          if (sessionResult.session_url) {
            toast.success("Redirecting to payment...");
            window.location.href = sessionResult.session_url;
          } else {
            toast.error("Payment session creation failed");
          }
        } catch (paymentError: any) {
          console.error("Error creating payment session:", paymentError);
          toast.error(
            "Order created but payment session failed. Please contact support."
          );
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    }
  };
  const { handleSectionEnter } = usePageVisitTracker();
  const hasTrackedExtended = useRef(false);
    
  // Track page visit on load
  useEffect(() => {
    handleSectionEnter("Cart Page", "Cart");
    
    // Track extended visit after 5 seconds
    const extendedTimer = setTimeout(() => {
      if (!hasTrackedExtended.current) {
        handleSectionEnter("Cart Page", "Cart");
        hasTrackedExtended.current = true;
      }
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(extendedTimer);
    };
  }, [handleSectionEnter]);

  // Loading stateHouse/Flat No. *
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 mt-[200px]">
        {/* Hero Section */}

        <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 xl:py-40">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
              <p className="text-orange-600 mt-4 font-medium">
                Loading your cart...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 mt-[200px]">
        <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 xl:py-40">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Cart
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen ">
      {regularItems.length === 0 &&
        bogoBundles.length === 0 &&
        processedBogoBundles.length === 0 && (
          <div className="  p-8 sm:p-12 mt-[200px] text-center">
            <div className="max-w-md mx-auto">
              {/* Empty Cart Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>

              {/* Empty Cart Message */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-8 text-base sm:text-lg">
                {` Looks like you haven't added any items to your cart yet. Browse
                our delicious menu and add some items to get started!`}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/menu"
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Utensils className="w-5 h-5" />
                  Browse Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  <strong>Pro Tip:</strong> Check out our special BOGO offers
                  for great deals on your favorite items!
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Only show cart content when there are items */}
      {(regularItems.length > 0 ||
        bogoBundles.length > 0 ||
        processedBogoBundles.length > 0) && (
        <div className="ah-container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 mt-[150px] md:mt-[200px]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Side - Cart Items and Guest Form (7/12 width on desktop) */}
              <div className="lg:col-span-7 order-1 space-y-6">
                {/* BOGO Bundles - Grouped Display */}
                {(bogoBundles.length > 0 ||
                  processedBogoBundles.length > 0) && (
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Special Offers
                    </h2>
                    <div className="space-y-4">
                      {/* Use processed bundles for authenticated users, API bundles for guests */}
                      {(processedBogoBundles.length > 0
                        ? processedBogoBundles
                        : bogoBundles
                      ).map((bundle, index) => {
                        const offer = bogoOffers.find(
                          (offer) => offer.id === bundle.bogo_offer_id
                        );

                        return offer ? (
                          <OfferGroupCard
                            key={`bundle-${bundle.bogo_offer_id}-${index}`}
                            bundle={bundle}
                            offer={offer}
                            onRemoveBundle={removeBogoBundle}
                            isLoading={cartItems.some(
                              (item) =>
                                item.is_bogo_item &&
                                item.bogo_offer_id === bundle.bogo_offer_id &&
                                loadingItems.has(item.id)
                            )}
                            loadingItems={loadingItems}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Empty Cart State */}

                {/* Regular Cart Items */}
                {regularItems.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Cart Items
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {regularItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-lg font-medium text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                {item.isBogoItem ? (
                                  <>
                                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                                      BOGO Item
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 line-through">
                                      ${item.originalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                                      ${item.price.toFixed(2)} each
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    ${item.price.toFixed(2)} each
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-sm sm:text-lg font-semibold text-orange-600">
                              ${(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>

                          {/* Quantity Controls - Hide for BOGO items */}
                          <div className="flex items-center justify-between">
                            {!item.isBogoItem ? (
                              <div className="flex items-center gap-1 sm:gap-2 border-2 border-orange-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-white shadow-sm">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  disabled={loadingItems.has(item.id)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Decrease quantity"
                                >
                                  {loadingItems.has(item.id) ? (
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                                  ) : (
                                    <svg
                                      className="w-3 h-3 sm:w-4 sm:h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  )}
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={
                                    quantityInputs[item.id] !== undefined
                                      ? quantityInputs[item.id]
                                      : item.qty
                                  }
                                  onChange={(e) =>
                                    handleQuantityInputChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  onBlur={() =>
                                    handleQuantityInputBlur(item.id)
                                  }
                                  className="min-w-6 sm:min-w-8 max-w-[60px] sm:max-w-[80px] text-center font-semibold text-xs sm:text-sm text-gray-900 bg-transparent border-none outline-none"
                                  disabled={loadingItems.has(item.id)}
                                />
                                <button
                                  onClick={() => updateQty(item.id, +1)}
                                  disabled={loadingItems.has(item.id)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 grid place-items-center rounded-md hover:bg-orange-100 transition-colors text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Increase quantity"
                                >
                                  {loadingItems.has(item.id) ? (
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                                  ) : (
                                    <svg
                                      className="w-3 h-3 sm:w-4 sm:h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 font-medium">
                                BOGO Item - Fixed Quantity
                              </div>
                            )}

                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={loadingItems.has(item.id)}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Remove item"
                            >
                              {loadingItems.has(item.id) ? (
                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                              ) : (
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guest Form - Only show if not authenticated */}
                {!isAuthenticated && (
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-orange-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Delivery Information
                    </h3>

                    <div className="space-y-4">
                      {/* Customer Information */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-600" />
                          Customer Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={guestFormData.customer_name}
                              onChange={(e) =>
                                handleGuestInputChange(
                                  "customer_name",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                                guestFormErrors.customer_name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter your full name"
                            />
                            {guestFormErrors.customer_name && (
                              <p className="text-red-500 text-xs mt-1">
                                {guestFormErrors.customer_name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={guestFormData.customer_phone}
                              onChange={(e) =>
                                handleGuestInputChange(
                                  "customer_phone",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                                guestFormErrors.customer_phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="+1234567890"
                            />
                            {guestFormErrors.customer_phone && (
                              <p className="text-red-500 text-xs mt-1">
                                {guestFormErrors.customer_phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={guestFormData.customer_email}
                            onChange={(e) =>
                              handleGuestInputChange(
                                "customer_email",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                              guestFormErrors.customer_email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="john@example.com"
                          />
                          {guestFormErrors.customer_email && (
                            <p className="text-red-500 text-xs mt-1">
                              {guestFormErrors.customer_email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          Delivery Address
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            House/Flat No. *
                          </label>
                          <input
                            type="text"
                            value={
                              guestFormData.delivery_address.address_line_1
                            }
                            onChange={(e) =>
                              handleGuestInputChange(
                                "delivery_address.address_line_1",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                              guestFormErrors.delivery_address?.address_line_1
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="House/Flat No."
                          />
                          {guestFormErrors.delivery_address?.address_line_1 && (
                            <p className="text-red-500 text-xs mt-1">
                              {guestFormErrors.delivery_address.address_line_1}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Road/Street Name *
                          </label>
                          <input
                            type="text"
                            value={
                              guestFormData.delivery_address.address_line_2
                            }
                            onChange={(e) =>
                              handleGuestInputChange(
                                "delivery_address.address_line_2",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="Road/Street Name"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              value={guestFormData.delivery_address.city}
                              onChange={(e) =>
                                handleGuestInputChange(
                                  "delivery_address.city",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                                guestFormErrors.delivery_address?.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="New York"
                            />
                            {guestFormErrors.delivery_address?.city && (
                              <p className="text-red-500 text-xs mt-1">
                                {guestFormErrors.delivery_address.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Post Code *
                            </label>
                            <input
                              type="text"
                              value={guestFormData.delivery_address.post_code}
                              onChange={(e) =>
                                handleGuestInputChange(
                                  "delivery_address.post_code",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                                guestFormErrors.delivery_address?.post_code
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="12345"
                            />
                            {guestFormErrors.delivery_address?.post_code && (
                              <p className="text-red-500 text-xs mt-1">
                                {guestFormErrors.delivery_address.post_code}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Details
                          </label>
                          <input
                            type="text"
                            value={guestFormData.delivery_address.details}
                            onChange={(e) =>
                              handleGuestInputChange(
                                "delivery_address.details",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="Ring doorbell twice"
                          />
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-600" />
                          Special Instructions
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                          </label>
                          <textarea
                            value={guestFormData.special_instructions}
                            onChange={(e) =>
                              handleGuestInputChange(
                                "special_instructions",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                            placeholder="Extra napkins please, or any other special requests..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Authenticated User Form - Editable form like guest form */}
                {isAuthenticated && (
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-orange-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Delivery Information
                    </h3>

                    <div className="space-y-4">
                      {/* Customer Information */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-600" />
                          Customer Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={authFormData.customer_name}
                              onChange={(e) =>
                                handleAuthInputChange(
                                  "customer_name",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={authFormData.customer_phone}
                              onChange={(e) =>
                                handleAuthInputChange(
                                  "customer_phone",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="+1234567890"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={authFormData.customer_email}
                            onChange={(e) =>
                              handleAuthInputChange(
                                "customer_email",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          Delivery Address
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            House/Flat No. *
                          
                          </label>
                          <input
                            type="text"
                            value={authFormData.delivery_address.address_line_1}
                            onChange={(e) =>
                              handleAuthInputChange(
                                "delivery_address.address_line_1",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="House/Flat No."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Road/Street Name
                         
                          </label>
                          <input
                            type="text"
                            value={authFormData.delivery_address.address_line_2}
                            onChange={(e) =>
                              handleAuthInputChange(
                                "delivery_address.address_line_2",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="Road/Street Name"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                          
                            </label>
                            <input
                              type="text"
                              value={authFormData.delivery_address.city}
                              onChange={(e) =>
                                handleAuthInputChange(
                                  "delivery_address.city",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="New York"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Post Code *
                            
                            </label>
                            <input
                              type="text"
                              value={authFormData.delivery_address.post_code}
                              onChange={(e) =>
                                handleAuthInputChange(
                                  "delivery_address.post_code",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              placeholder="12345"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Details
                        
                          </label>
                          <input
                            type="text"
                            value={authFormData.delivery_address.details}
                            onChange={(e) =>
                              handleAuthInputChange(
                                "delivery_address.details",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            placeholder="Ring doorbell twice"
                          />
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-600" />
                          Special Instructions
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                          </label>
                          <textarea
                            value={specialInstructions}
                            onChange={(e) =>
                              setSpecialInstructions(e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                            placeholder="Extra napkins please, or any other special requests..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Order Summary (5/12 width on desktop) - Only show when cart has items */}
              {(regularItems.length > 0 ||
                bogoBundles.length > 0 ||
                processedBogoBundles.length > 0) && (
                <div className="lg:col-span-5 order-2 lg:order-2">
                  <OrderSummary
                    summary={summary}
                    onCheckout={handleCheckout}
                    isFormValid={isGuestFormValid}
                    isLoading={Boolean(
                      createOrderLoading ||
                        createGuestOrderLoading ||
                        createSessionLoading ||
                        paymentLoading
                    )}
                    bogoBundles={
                      processedBogoBundles.length > 0
                        ? processedBogoBundles
                        : bogoBundles
                    }
                    bogoOffers={bogoOffers}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
