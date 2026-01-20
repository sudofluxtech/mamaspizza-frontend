"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback } from "react";
import { useOrderStore } from "@/lib/stores/orderStore";
import { MenuItem } from "@/hooks/menu.hook";

// interface Size {
//   id: string;
//   size: number;
//   status: "active" | "inactive" | string | number;
//   created_at: string;
//   updated_at: string;
// }

interface MenuCardProps {
  menu: MenuItem;
  index?: number;
  onAddToCart?: (menu: MenuItem) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onAddToCart,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const { canOrder } = useOrderStore();


  // const [sizes, setSizes] = useState<Size[]>([]); // Currently unused
  // const [sizesLoading, setSizesLoading] = useState(false); // Currently unused
  // const [sizesError, setSizesError] = useState<string | null>(null); // Currently unused

  // Fetch sizes when component mounts - Currently disabled
  // useEffect(() => {
  //   const fetchSizes = async () => {
  //     setSizesLoading(true);
  //     setSizesError(null);

  //     try {
  //       const response = await fetch(SIZES_API, {
  //         headers: {
  //           'Accept': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();

  //       if (result.success && result.data) {
  //         setSizes(result.data);
  //       } else {
  //         console.warn('Sizes API returned unsuccessful response:', result);
  //         setSizes([]);
  //       }
  //     } catch (err: any) {
  //       console.error('Error fetching sizes:', err);
  //       setSizesError(err.message);
  //       setSizes([]);
  //     } finally {
  //       setSizesLoading(false);
  //     }
  //   };

  //   fetchSizes();
  // }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!canOrder || isLoading) {
        return; // Don't proceed if canOrder is false or already loading
      }

      if (onAddToCart) {
        onAddToCart(menu);
      } else {
        // console.log('MenuCard: onAddToCart function is not provided');
      }
    },
    [canOrder, isLoading, onAddToCart, menu]
  );

  return (
    <motion.div
      key={menu.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 group h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <Image
          width={400}
          height={300}
          src={
            menu.thumbnail
              ? `${process.env.NEXT_PUBLIC_API_URL}/public/${menu.thumbnail}`
              : "/placeholder-avatar.svg"
          }
          // src={`${process.env.NEXT_PUBLIC_API_URL}/public/${menu.thumbnail}`}
          alt={menu.name}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs hidden">
          <span>No Image</span>
        </div>
        <div className="absolute top-3 right-3 ">
          {menu.category.name.toLowerCase() === "pizza" && menu.size && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {menu.size.size}&quot; Size
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {menu.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {menu.details}
          </p>

          {/* Size Section - Only show for Pizza category */}

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-600">
              ${parseFloat(menu.main_price).toFixed(2)}
            </span>
            {menu.prev_price &&
              parseFloat(menu.prev_price) > parseFloat(menu.main_price) && (
                <span className="text-sm text-gray-400 line-through">
                  ${parseFloat(menu.prev_price).toFixed(2)}
                </span>
              )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 mb-2">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !canOrder || !!error}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : !canOrder
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : error
              ? "bg-red-100 text-red-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : !canOrder ? (
            "Not Available"
          ) : error ? (
            "Error - Try Again"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
