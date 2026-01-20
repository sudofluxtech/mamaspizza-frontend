'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/category.hook";
import { useMenus } from "@/hooks/menu.hook";
import { useBogoOffers } from "@/hooks/bogo-offer.hooks";
import { useAuth } from "@/lib/stores/useAuth";
import { useCartStore } from "@/lib/stores/cartStore";
import { useGuest } from "@/lib/guest/GuestProvider";
import MenuCard from "@/components/MenuCard";
import MenuOfferCards from "@/components/pages/home-page/MenuOfferCards";
import { Utensils, Pizza, Coffee, Sandwich, Percent } from "lucide-react";
import { toast } from "sonner";
import { GUEST_CART_API, USER_CART_API } from "@/app/api";

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
    "All": Utensils,
    "Offer": Percent,
    "Pizza": Pizza,
    "Burgers": Sandwich,
    "Drinks": Coffee,
    "default": Utensils
};

const MenuSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [openOfferId, setOpenOfferId] = useState<number | null>(null);
    const [loadingOffers, setLoadingOffers] = useState<Set<number>>(new Set());

    // --- Hooks ---
    const { categories } = useCategories();
    const { bogoOffers, loading: bogoOffersLoading, error: bogoOffersError } = useBogoOffers();
    const { token, isAuthenticated } = useAuth();
    const { incrementItemCount } = useCartStore();
    const { guestId } = useGuest();

    // // Debug logging
    // console.log('MenuSection Debug:', {
    //     bogoOffers,
    //     bogoOffersLoading,
    //     bogoOffersError,
    //     activeTab
    // });

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
    //     setOpenOfferId(null);
    //     setLoadingOffers(new Set());
    // };
    
    // Find the selected category ID
    const selectedCategory = categories.find(cat => cat.name === activeTab);
    const categoryId = selectedCategory ? selectedCategory.id.toString() : undefined;
    
    const { menus, loading: menuLoading } = useMenus({
        category_id: categoryId,
        per_page: 8, // Show 8 items on home page
    });



    
        const menuTabs1 = [
        { name: "All", icon: Utensils },
        { name: "Offer", icon: Utensils },
        ...categories.map(cat => ({
            name: cat.name,
            icon: categoryIcons[cat.name] || categoryIcons.default
        }))
    ];
    

    // Guest cart function
    const handleGuestAddtoCart = async (menu: any) => {
        
        // Set loading state
        setLoadingItems(prev => new Set(prev).add(menu.id));
        
        try {
            
            if (!guestId) {
                console.error('Guest ID not available');
                toast.error('Guest ID not available');
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
                incrementItemCount(1); // Update global cart count
                toast.success(`${menu.name} added to cart!`, {
                    description: "Item added to your guest cart",
                    duration: 3000,
                });
            } else {
                console.error('Failed to add to guest cart');
                toast.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to guest cart:', error);
            toast.error('Error adding item to cart');
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
        
        // Set loading state
        setLoadingItems(prev => new Set(prev).add(menu.id));
        
        try {
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
            } else {
                console.error('Failed to add to user cart');
                toast.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to user cart:', error);
            toast.error('Error adding item to cart');
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
    const handleCartAdd = (menu: any) => {
        // Prevent multiple clicks if already loading
        if (loadingItems.has(menu.id)) {
            return;
        }
        
        if (isAuthenticated) {
            handleAddtoCart(menu);
        } else {
            handleGuestAddtoCart(menu);
        }
    };

    return (
        <section className="bg-white fade-top-mask z-20 py-20">
            <div className="ah-container mx-auto">
                {/* Title & Subtitle */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                        Fresh & Delicious
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-gray-900">Try Our</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500"> Amazing Menu</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-xl mx-auto">
                        Discover our carefully curated selection of mouthwatering dishes, 
                        prepared with the finest ingredients.
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-16">
                    {/* Mobile Scrollable Tabs */}
                    <div className="flex overflow-x-auto gap-4 py-8 px-5 md:flex-wrap md:justify-center scrollbar-hide">
                        {menuTabs1.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.name;

                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`
                                        group relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 
                                        flex items-center gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px] justify-center flex-shrink-0
                                        ${isActive
                                            ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-200 transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-100 hover:border-orange-200'
                                        }
                                    `}
                                >
                                    {/* Icon */}
                                    <IconComponent
                                        size={18}
                                        className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'
                                            }`}
                                    />

                                    {/* Text */}
                                    <span className="font-semibold text-sm sm:text-base">{tab.name}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* Food Cards */}
                <div>
                    {activeTab === "Offer" ? (
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
                        // Show Regular Menu Items
                        menuLoading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                                <p className="text-orange-600 mt-4 font-medium">Loading delicious menu items...</p>
                            </div>
                        ) : menus.length > 0 ? (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            >
                                {menus.map((menu, index) => (
                                    <MenuCard
                                        key={menu.id}
                                        menu={menu}
                                        index={index}
                                        onAddToCart={handleCartAdd}
                                        isLoading={loadingItems.has(menu.id)}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                                    <div className="text-gray-400 mb-4">
                                        <Utensils size={48} className="mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                                    <p className="text-gray-500">We couldn&apos;t find any items in this category.</p>
                                </div>
                            </div>
                        )
                    )}
                </div>

            </div>
        </section>


    );
};

export default MenuSection;
