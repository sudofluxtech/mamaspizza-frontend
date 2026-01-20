// Get API URL with fallback
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// user authentication api
export const LOGIN_API = `${API_BASE_URL}/api/v1/login`;
export const REGISTER_API = `${API_BASE_URL}/api/v1/register`;
export const LOGOUT_API = `${API_BASE_URL}/api/v1/logout`;
export const LOGOUT_ALL_API = `${API_BASE_URL}/api/v1/logout-all`;
export const ME_API = `${API_BASE_URL}/api/v1/me`;
export const USER_API = `${API_BASE_URL}/api/v1/user`;
export const UPDATE_PROFILE_API = `${API_BASE_URL}/api/v1/me`;
export const CHANGE_PASSWORD_API = `${API_BASE_URL}/api/v1/change-password`;
export const DELIVERY_ADDRESSES_API = `${API_BASE_URL}/api/v1/delivery-addresses`;
export const DELIVERY_ADDRESS_BY_ID_API = `${API_BASE_URL}/api/v1/delivery-addresses`;

// post codes api
export const POST_CODES_API = `${API_BASE_URL}/api/v1/post-codes`;
export const POST_CODE_BY_ID_API = `${API_BASE_URL}/api/v1/post-codes`;
export const GUEST_POST_CODES_API = `${API_BASE_URL}/api/v1/guest-post-codes`;
export const GUEST_POST_CODE_BY_ID_API = `${API_BASE_URL}/api/v1/guest-post-codes`;

// users api
export const GET_ALL_USERS_API = `${API_BASE_URL}/api/v1/users`; // GET with user_id/delivery-addresses

// ==================== RESTAURANT MANAGEMENT APIs ====================
export const RESTAURANTS_API = `${API_BASE_URL}/api/v1/restaurants`;
export const RESTAURANT_BY_ID_API = `${API_BASE_URL}/api/v1/restaurants`;

// ==================== CATEGORY MANAGEMENT APIs ====================
export const CATEGORIES_API = `${API_BASE_URL}/api/v1/categories`;
export const CATEGORY_BY_ID_API = `${API_BASE_URL}/api/v1/categories`;

// ==================== ITEM/MENU MANAGEMENT APIs ====================
export const ITEMS_API = `${API_BASE_URL}/api/v1/items`;
export const ITEM_BY_ID_API = `${API_BASE_URL}/api/v1/items`;

// ==================== ADMIN USER MANAGEMENT APIs ====================
export const CREATE_USER_API = `${API_BASE_URL}/api/v1/create/user`;
export const USERS_API = `${API_BASE_URL}/api/v1/users`;

// ==================== ADMIN ORDER MANAGEMENT APIs ====================
export const ADMIN_ORDERS_API = `${API_BASE_URL}/api/v1/admin/orders`;
export const ADMIN_ORDER_BY_ID_API = `${API_BASE_URL}/api/v1/admin/orders`;

// ==================== CART APIs ====================
// export const CART_API = `${API_BASE_URL}/api/v1/cart`;
export const GUEST_CART_API = `${API_BASE_URL}/api/v1/guest/cart`;
export const USER_CART_API = `${API_BASE_URL}/api/v1/user/cart`;
export const CART_SUMMARY_API = `${API_BASE_URL}/api/v1/cart-summary`;

// ==================== ORDER APIs ====================
export const ORDERS_API = `${API_BASE_URL}/api/v1/orders`;
export const USER_ORDERS_API = `${API_BASE_URL}/api/v1/orders`;
export const GUEST_ORDER_API = `${API_BASE_URL}/api/v1/guest/orders`;
export const ORDER_BY_ID_API = `${API_BASE_URL}/api/v1/orders`;
export const ORDER_CANCEL_API = `${API_BASE_URL}/api/v1/orders`;
export const ORDER_SUMMARY_API = `${API_BASE_URL}/api/v1/orders`;
export const ORDER_PAYMENT_STATUS_API = `${API_BASE_URL}/api/v1/orders`;

export const ORDER_DETAILS_API = `${API_BASE_URL}/api/v1/order-details/`;

// ==================== STRIPE PAYMENT APIs ====================
export const STRIPE_CREATE_SESSION_API = `${API_BASE_URL}/api/v1/payments/create-session`;
export const USER_STRIPE_CREATE_SESSION_API = `${API_BASE_URL}/api/v1/payments/create-session`;
export const STRIPE_VERIFY_PAYMENT_API = `${API_BASE_URL}/api/v1/payments/verify`;
export const STRIPE_SESSION_STATUS_API = `${API_BASE_URL}/api/v1/payments/session-status`;
export const STRIPE_WEBHOOK_API = `${API_BASE_URL}/api/v1/stripe/webhook`;

// ==================== GUEST PAYMENT APIs ====================
export const GUEST_STRIPE_CREATE_SESSION_API = `${API_BASE_URL}/api/v1/guest/payments/create-session`;
export const GUEST_STRIPE_VERIFY_PAYMENT_API = `${API_BASE_URL}/api/v1/guest/payments/verify`;
export const GUEST_STRIPE_SESSION_STATUS_API = `${API_BASE_URL}/api/v1/guest/payments/session-status`;

// ==================== SIZES APIs ====================
export const SIZES_API = `${API_BASE_URL}/api/v1/sizes`;

// ==================== HELPER FUNCTIONS ====================
// Helper function to get delivery addresses for a specific user
export const getUserDeliveryAddresses = (userId: string) =>
  `${GET_ALL_USERS_API}/${userId}/delivery-addresses`;

// Helper function to get specific delivery address
export const getDeliveryAddressById = (addressId: string) =>
  `${DELIVERY_ADDRESSES_API}/${addressId}`;

// Helper function to get specific restaurant
export const getRestaurantById = (restaurantId: string) =>
  `${RESTAURANTS_API}/${restaurantId}`;

// Helper function to get specific category
export const getCategoryById = (categoryId: string) =>
  `${CATEGORIES_API}/${categoryId}`;

// Helper function to get specific item
export const getItemById = (itemId: string) => `${ITEMS_API}/${itemId}`;
export const getOrderDetailsByorderNumber = (orderNumber: string) =>
  `${ORDER_DETAILS_API}${orderNumber}`;

// Helper function to get specific order
export const getOrderById = (orderId: string) =>
  `${ORDER_BY_ID_API}/${orderId}`;

// Helper function to cancel order
export const cancelOrder = (orderId: string) =>
  `${ORDER_CANCEL_API}/${orderId}/cancel`;

// Helper function to get order summary
export const getOrderSummary = (orderId: string) =>
  `${ORDER_SUMMARY_API}/${orderId}/summary`;

// Helper function to update payment status
export const updateOrderPaymentStatus = (orderId: string) =>
  `${ORDER_PAYMENT_STATUS_API}/${orderId}/payment-status`;

// Helper function to get specific post code
export const getPostCodeById = (postCodeId: string) =>
  `${POST_CODE_BY_ID_API}/${postCodeId}`;

export const getPostCodeByCode = (code: string) =>
  `${POST_CODES_API}/isCodeMatched?code=${code}`;

// Helper function to get specific guest post code
export const getGuestPostCodeById = (postCodeId: string) =>
  `${GUEST_POST_CODE_BY_ID_API}/${postCodeId}`;

// Helper function to get guest order by order number
export const getGuestOrderByNumber = (orderNumber: string) =>
  `${GUEST_ORDER_API}/${orderNumber}`;

// Helper function to get admin order by ID
export const getAdminOrderById = (orderId: string) =>
  `${ADMIN_ORDER_BY_ID_API}/${orderId}`;

// Helper function to cancel admin order
export const cancelAdminOrder = (orderId: string) =>
  `${ADMIN_ORDER_BY_ID_API}/${orderId}/cancel`;

// Helper function to get specific size
export const getSizeById = (sizeId: string) => `${SIZES_API}/${sizeId}`;

// Helper function to get specific guest
export const getGuestById = (guestId: string) =>
  `${GUEST_BY_ID_API}/${guestId}`;

// ==================== LEGACY COMPATIBILITY (for existing code) ====================
// These maintain backward compatibility with existing code
export const MENUS_API = ITEMS_API; // Items are menus in your system
export const ADD_TO_CART_API = USER_CART_API; // Add to cart uses cart endpoint
export const REMOVE_FROM_CART_API = USER_CART_API; // Remove from cart uses cart endpoint
export const UPDATE_CART_API = USER_CART_API; // Update cart uses cart endpoint
export const CREATE_ORDER_API = ORDERS_API; // Create order uses orders endpoint
// export const ORDER_DETAILS_API = ORDERS_API; // Order details uses orders endpoint
export const USER_PROFILE_API = ME_API; // User profile uses me endpoint
export const RESTAURANT_INFO_API = RESTAURANTS_API; // Restaurant info uses restaurants endpoint
export const DELIVERY_AREAS_API = DELIVERY_ADDRESSES_API; // Delivery areas uses delivery addresses
export const DELIVERY_ADDRESS_API = DELIVERY_ADDRESSES_API; // Delivery address uses delivery addresses
export const ADMIN_MENUS_API = ITEMS_API; // Admin menus uses items endpoint
export const ADMIN_CATEGORIES_API = CATEGORIES_API; // Admin categories uses categories endpoint
export const ADMIN_USERS_API = USERS_API; // Admin users uses users endpoint
export const ADMIN_DASHBOARD_API = `${API_BASE_URL}/api/v1/admin/dashboard`; // Admin dashboard (to be implemented)

export const ADMIN_OFFERS_API = `${API_BASE_URL}/api/v1/bogo-offers`;
export const USER_BOGO_OFFERS_API = `${API_BASE_URL}/api/v1/user/bogo-offers`;
export const CREATE_ORDER_FROM_OFFER_API = `${API_BASE_URL}/api/v1/offers/add-to-cart`;
export const CREATE_ORDER_FROM_OFFER_API_USER = `${API_BASE_URL}/api/v1/offers/user/add-to-cart`;

// ==================== CONTACT APIs ====================
export const CONTACTS_API = `${API_BASE_URL}/api/v1/contacts`;

// ==================== GUESTS APIs ====================
export const GUESTS_API = `${API_BASE_URL}/api/v1/guests`;
export const GUEST_BY_ID_API = `${API_BASE_URL}/api/v1/guests`;
