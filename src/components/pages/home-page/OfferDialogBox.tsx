"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BogoOffer } from "@/hooks/bogo-offer.hooks"
import type React from "react"
import { useState, useEffect } from "react"
import { type MenuItem, useMenus } from "@/hooks/menu.hook"
import { useSizes } from "@/hooks/sizes.hook"
import { useGuest } from "@/lib/guest/GuestProvider"
import { useRouter } from "next/navigation"
import { CREATE_ORDER_FROM_OFFER_API, CREATE_ORDER_FROM_OFFER_API_USER } from "@/app/api"
import { Check } from "lucide-react"
import { useAuth } from "@/lib/stores/useAuth"
import { useCartStore } from "@/lib/stores/cartStore"
import Image from "next/image"

interface OfferDialogBoxProps {
  offer: BogoOffer
  open: boolean
  setOpen: (open: boolean) => void
}

type SelectionStep = "size" | "items"

// Helper function to convert numbers to ordinal format
const getOrdinalNumber = (num: number): string => {
  const ordinals = [
    '', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
    'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'
  ]
  
  if (num <= 20) {
    return ordinals[num]
  }
  
  // For numbers above 20, we'll use a simple approach
  return `${num}th`
}

const OfferDialogBox: React.FC<OfferDialogBoxProps> = ({ offer, open, setOpen }) => {
  const { guestId } = useGuest()
  const { sizes, loading: sizesLoading } = useSizes()
  const { token, isAuthenticated, user } = useAuth()
  const { incrementItemCount } = useCartStore()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<SelectionStep>("size")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedBuyItems, setSelectedBuyItems] = useState<MenuItem[]>([])
  const [selectedFreeItems, setSelectedFreeItems] = useState<MenuItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemsStepMode, setItemsStepMode] = useState<"buy" | "free">("buy")
  const [itemsStepIndex, setItemsStepIndex] = useState<number>(0)
  // console.log(selectedSi ze)

  const { menus: visibleMenus, loading: menusLoading } = useMenus({
    category_id: offer.category_id?.toString(),
    size_id: selectedSize ? Number.parseInt(selectedSize) : undefined,
    per_page: 50,
  })

  useEffect(() => {
    if (open) {
      setCurrentStep("size")
      setSelectedSize("")
      setSelectedBuyItems([])
      setSelectedFreeItems([])
      setItemsStepMode("buy")
      setItemsStepIndex(0)
    }
  }, [open])

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId)
    setCurrentStep("items")
    setItemsStepMode("buy")
    setItemsStepIndex(0)
  }

  const selectBuyItem = (item: MenuItem) => {
    setSelectedBuyItems((prev) => {
      const next = [...prev]
      next[itemsStepIndex] = item
      return next
    })
  }

  const goBackStep = () => {
    if (currentStep === "size") return
    if (itemsStepMode === "buy") {
      if (itemsStepIndex > 0) {
        setItemsStepIndex(itemsStepIndex - 1)
      } else {
        setCurrentStep("size")
      }
    } else {
      if (itemsStepIndex > 0) {
        setItemsStepIndex(itemsStepIndex - 1)
      } else {
        setItemsStepMode("buy")
        setItemsStepIndex(Math.max(offer.buy_quantity - 1, 0))
      }
    }
  }

  const selectFreeItem = (item: MenuItem) => {
    setSelectedFreeItems((prev) => {
      const next = [...prev]
      next[itemsStepIndex] = item
      return next
    })
  }

  const goNextStep = () => {
    if (itemsStepMode === "buy") {
      if (itemsStepIndex < offer.buy_quantity - 1) {
        setItemsStepIndex(itemsStepIndex + 1)
      } else {
        setItemsStepMode("free")
        setItemsStepIndex(0)
      }
    } else {
      if (itemsStepIndex < offer.get_quantity - 1) {
        setItemsStepIndex(itemsStepIndex + 1)
      }
    }
  }

  const handleAddToCart = async () => {
    // Prepare the order data with proper typing
    // UI shows individual steps, but API receives grouped data
    const orderData: {
      bogo_offer_id: number;
      buy_items: number[];  // All buy items grouped as single array
      free_items: number[]; // All free items grouped as single array
      user_id?: number;
      guest_id?: string;
    } = {
      bogo_offer_id: offer.id,
      buy_items: selectedBuyItems.filter(item => item).map((item) => item.id), // Group all buy items as single array
      free_items: selectedFreeItems.map((item) => item.id),
    }

    // Add user/guest identification based on authentication status
    if (isAuthenticated && user?.id) {
      orderData.user_id = user.id
    } else if (guestId) {
      orderData.guest_id = guestId
    } else {
      alert("Unable to identify user. Please refresh and try again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Choose the correct API endpoint based on authentication status
      const apiEndpoint = isAuthenticated
        ? CREATE_ORDER_FROM_OFFER_API_USER
        : CREATE_ORDER_FROM_OFFER_API

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add authorization header for authenticated users
      if (isAuthenticated && token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Calculate total items added (buy + free items)
        const totalItems = selectedBuyItems.length + selectedFreeItems.length
        incrementItemCount(totalItems) // Update global cart count
        setOpen(false)
        router.push("/cart")
      } else {
        alert(result.message || "Failed to add items to cart")
      }
    } catch (error) {
      console.error("Error adding offer to cart:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSelectionComplete =
    selectedBuyItems.filter(Boolean).length === offer.buy_quantity && selectedFreeItems.filter(Boolean).length === offer.get_quantity


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold">{offer.title}</DialogTitle>
        <p className="text-sm text-muted-foreground">{offer.description}</p>

        {/* Step 1: Size Selection */}
        {currentStep === "size" && (
          <div className="py-6">
            <div className="max-w-md mx-auto space-y-6">
              {/* <Label
                htmlFor="size-select"
                className="block text-sm font-medium text-gray-900"
              >
                Size
              </Label> */}

              {sizesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <Select onValueChange={handleSizeSelect} value={selectedSize}>
                  <SelectTrigger
                    id="size-select"
                    className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {sizes.map((size) => (
                      <SelectItem
                        key={size.id}
                        value={size.id}
                        className="text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                      >
                        {size.size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Items - Dynamic sub-steps (buy → free) */}
        {currentStep === "items" && (
          <div>
            <div >
              <div className=" border border-white/60 rounded-2xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goBackStep}
                      className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm h-7"
                    >
                      ← 
                    </Button>
                    <h3 className="text-base font-bold text-gray-800">
                      Select your {getOrdinalNumber(itemsStepMode === "buy" ? itemsStepIndex + 1 : offer.buy_quantity + itemsStepIndex + 1)} item
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("size")}
                    className="hidden md:block bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm h-7"
                  >
                    Change Size
                  </Button>
                </div>
              </div>

              {/* Items Grid - cleaner visible cards */}
              {menusLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                    <span className="text-xs text-gray-600">Loading items...</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {visibleMenus?.map((menu) => {
                    const isSelectedForStep = itemsStepMode === "buy" ? selectedBuyItems[itemsStepIndex]?.id === menu.id : selectedFreeItems[itemsStepIndex]?.id === menu.id
                    return (
                      <button
                        key={menu.id}
                        onClick={() => (itemsStepMode === "buy" ? selectBuyItem(menu) : selectFreeItem(menu))}
                        className={`w-full text-left group`}
                      >
                        <div className={`rounded-xl border transition-all ${isSelectedForStep ? "border-orange-500 ring-2 ring-blue-200 bg-white" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                          <div className="flex gap-3 p-3">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              {menu.thumbnail ? (
                                <Image width={56} height={56} src={`${process.env.NEXT_PUBLIC_API_URL}/public/${menu.thumbnail}`} alt={menu.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold mb-0.5 ${isSelectedForStep ? "text-gray-900" : "text-gray-800"}`}>{menu.name}</div>
                              {menu.details && (
                                <div className="text-xs text-gray-600 line-clamp-2">{menu.details}</div>
                              )}
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isSelectedForStep ? "bg-orange-500" : "bg-gray-200"}`}>
                              {isSelectedForStep && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Step controls */}
              <div className="mt-4 flex items-center justify-between">
               
                {itemsStepMode === "free" && itemsStepIndex === Math.max(offer.get_quantity - 1, 0) ? (
                  <Button
                    disabled={!isSelectionComplete || isSubmitting}
                    className="ml-auto h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 text-sm font-semibold"
                    onClick={handleAddToCart}
                  >
                    {isSubmitting ? "Adding..." : "Add to Cart"}
                  </Button>
                ) : (
                  <Button
                    disabled={itemsStepMode === "buy" ? !selectedBuyItems[itemsStepIndex] : !selectedFreeItems[itemsStepIndex]}
                    className="ml-auto h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 text-sm font-semibold"
                    onClick={goNextStep}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OfferDialogBox
