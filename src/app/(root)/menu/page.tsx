'use client'

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/category.hook";
import { useMenus } from "@/hooks/menu.hook";
import { useBogoOffers } from "@/hooks/bogo-offer.hooks";
import { useSizes } from "@/hooks/sizes.hook";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/stores/useAuth";
import { useCartStore } from "@/lib/stores/cartStore";
import { useGuest } from "@/lib/guest/GuestProvider";
import MenuCard from "@/components/MenuCard";
import MenuOfferCards from "@/components/pages/home-page/MenuOfferCards";
import { Utensils, Percent, Filter } from "lucide-react";
import { toast } from "sonner";
import { GUEST_CART_API, USER_CART_API } from "@/app/api";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

const Menu = () => {
  // --- State ---
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>(undefined);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [itemErrors, setItemErrors] = useState<Map<number, string>>(new Map());
  const [openOfferId, setOpenOfferId] = useState<number | null>(null);
  const [loadingOffers, setLoadingOffers] = useState<Set<number>>(new Set());
  const perPage = 6; // items per page

  const debouncedSearch = useDebounce(search, 500);

  // --- Hooks ---
  const { categories, loading: catLoading } = useCategories();
  const { sizes, loading: sizesLoading } = useSizes();
  const { bogoOffers, loading: bogoOffersLoading, error: bogoOffersError } = useBogoOffers();
  const { token, isAuthenticated } = useAuth();
  const { incrementItemCount } = useCartStore();
  const { guestId } = useGuest();
  const { menus, loading: menuLoading, pagination } = useMenus({
    category_id: categoryId,
    size_id: selectedSizeId ? parseInt(selectedSizeId) : undefined,
    per_page: perPage,
    page,
    search: debouncedSearch,
    ordering: '-created_at',
    status: 1,
  });


  // --- Handlers ---
  const handleCategoryClick = (id?: string) => {
    setCategoryId(id);
    setPage(1);
    // Clear errors when changing category
    setItemErrors(new Map());
  };

  const handleSizeClick = (sizeId?: string) => {
    setSelectedSizeId(sizeId);
    setPage(1);
    // Clear errors when changing size
    setItemErrors(new Map());
  };


  // Clear error for specific item
  const clearItemError = (itemId: number) => {
    setItemErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  };

  // Set error for specific item
  const setItemError = (itemId: number, error: string) => {
    setItemErrors(prev => new Map(prev).set(itemId, error));
  };

  // Handle offer modal opening
  const handleOfferModalOpen = (offerId: number) => {
    // Prevent opening if already open or loading
    if (openOfferId === offerId || loadingOffers.has(offerId)) {
      return;
    }
    
    setLoadingOffers(prev => new Set(prev).add(offerId));
    
    // Simulate loading delay (you can replace this with actual API call)
    setTimeout(() => {
      setOpenOfferId(offerId);
      setLoadingOffers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offerId);
        return newSet;
      });
    }, 300);
  };

  // const handleOfferModalClose = () => {
  //   setOpenOfferId(null);
  //   setLoadingOffers(new Set());
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    // Clear errors when searching
    setItemErrors(new Map());
  };

  const handlePrevPage = () => {
    if (pagination?.has_prev_page) setPage(prev => prev - 1);
  };
  const handleNextPage = () => {
    if (pagination?.has_next_page) setPage(prev => prev + 1);
  };

  // Guest cart function
  const handleGuestAddtoCart = async (menu: any) => {
    // Clear any existing error for this item
    clearItemError(menu.id);
    
    // Set loading state
    setLoadingItems(prev => new Set(prev).add(menu.id));
    
    try {
      if (!guestId) {
        const errorMsg = 'Guest ID not available. Please refresh the page.';
        setItemError(menu.id, errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      const response = await fetch(GUEST_CART_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_id: guestId,
          item_id: menu.id,
          quantity: 1
        })
      });

      if (response.ok) {
        await response.json();
        toast.success(`${menu.name} added to cart!`, {
          description: "Item added to your guest cart",
          duration: 3000,
        });
        // Clear any previous errors
        clearItemError(menu.id);
      } else {
        let errorMessage = `Failed to add item to cart (${response.status})`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        setItemError(menu.id, errorMessage);
        toast.error(errorMessage);
        console.error('Failed to add to guest cart:', response.status, response.statusText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please check your connection.';
      setItemError(menu.id, errorMessage);
      toast.error(errorMessage);
      console.error('Error adding to guest cart:', error);
    } finally {
      // Remove loading state
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(menu.id);
        return newSet;
      });
    }
  };

  // Authenticated user cart function
  const handleAddtoCart = async (menu: any) => {
    // Clear any existing error for this item
    clearItemError(menu.id);
    
    // Set loading state
    setLoadingItems(prev => new Set(prev).add(menu.id));
    
    try {
      if (!token) {
        const errorMsg = 'Authentication required. Please log in.';
        setItemError(menu.id, errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      const response = await fetch(USER_CART_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: menu.id,
          quantity: 1
        })
      });

      if (response.ok) {
        await response.json();
        incrementItemCount(1); // Update global cart count
        toast.success(`${menu.name} added to cart!`, {
          description: "Item added to your cart",
          duration: 3000,
        });
        // Clear any previous errors
        clearItemError(menu.id);
      } else {
        let errorMessage = `Failed to add item to cart (${response.status})`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        setItemError(menu.id, errorMessage);
        toast.error(errorMessage);
        console.error('Failed to add to user cart:', response.status, response.statusText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please check your connection.';
      setItemError(menu.id, errorMessage);
      toast.error(errorMessage);
      console.error('Error adding to user cart:', error);
    } finally {
      // Remove loading state
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(menu.id);
        return newSet;
      });
    }
  };

  // Main cart handler that checks authentication
  const handleAddToCart = (menu: any) => {
    if (isAuthenticated) {
      handleAddtoCart(menu);
    } else {
      handleGuestAddtoCart(menu);
    }
  };

  // Retry function for failed cart operations
  const handleRetryAddToCart = (menu: any) => {
    handleAddToCart(menu);
  };

  const { handleSectionEnter } = usePageVisitTracker();
  const hasTrackedExtended = useRef(false);
    
  // Track page visit on load
  useEffect(() => {
    handleSectionEnter("Menu Page", "Menu");
    
    // Track extended visit after 5 seconds
    const extendedTimer = setTimeout(() => {
      if (!hasTrackedExtended.current) {
        handleSectionEnter("Menu Page", "Menu");
        hasTrackedExtended.current = true;
      }
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(extendedTimer);
    };
  }, [handleSectionEnter]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-10 mt-[180px]">
        {/* --- Minimal Header --- */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-800 mb-6">Menu</h1>
        </div>

        {/* --- Search and Filter Row --- */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 shadow-sm bg-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Size Filter */}
          {categoryId !== "offers" && (
            <div className="relative">
              <select
                value={selectedSizeId || ""}
                onChange={(e) => handleSizeClick(e.target.value || undefined)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 shadow-sm hover:border-gray-400 transition-colors min-w-[120px]"
                disabled={sizesLoading}
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.size}&quot;
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter size={14} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* --- Categories --- */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
              !categoryId
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <Utensils size={14} />
            All
          </button>
          <button
            onClick={() => handleCategoryClick("offers")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
              categoryId === "offers"
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <Percent size={14} />
            Offers
          </button>
          {catLoading ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : (
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  categoryId === cat.id
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>


        {/* --- Menus --- */}
        {categoryId === "offers" ? (
          bogoOffersLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
              <p className="text-orange-600 mt-4 font-medium">Loading amazing offers...</p>
            </div>
          ) : bogoOffersError ? (
            <div className="text-center py-20">
              <div className="bg-red-50 rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-red-400 mb-4">
                  <Percent size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error loading offers</h3>
                <p className="text-red-500 mb-4">{bogoOffersError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : bogoOffers.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {bogoOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MenuOfferCards 
                    offer={offer} 
                    isModalOpen={openOfferId === offer.id}
                    onModalOpen={handleOfferModalOpen}
                    isLoading={loadingOffers.has(offer.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Percent size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers available</h3>
                <p className="text-gray-500">Check back later for amazing deals!</p>
              </div>
            </div>
          )
        ) : (
          menuLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
              <p className="text-orange-600 mt-4 font-medium">Loading menus...</p>
            </div>
          ) : menus.length === 0 ? (
            <p className="text-center text-orange-400 py-12 text-lg">No menus found.</p>
           ) : (
             <motion.div
               layout
               className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
             >
               {menus.map((menu, index) => (
                 <MenuCard
                   key={menu.id}
                   menu={menu}
                   index={index}
                   onAddToCart={handleAddToCart}
                   isLoading={loadingItems.has(menu.id)}
                   error={itemErrors.get(menu.id) || null}
                   onRetry={() => handleRetryAddToCart(menu)}
                 />
               ))}
             </motion.div>
           )
        )}

        {/* --- Pagination --- */}
        {pagination && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={!pagination.has_prev_page}
              onClick={handlePrevPage}
              className="px-6 py-2.5 border-2 border-orange-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
            >
              Previous
            </button>
            <span className="text-orange-700 font-medium px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              disabled={!pagination.has_next_page}
              onClick={handleNextPage}
              className="px-6 py-2.5 border-2 border-orange-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;