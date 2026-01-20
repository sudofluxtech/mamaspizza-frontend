"use client";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  MenuIcon,
  ShoppingCart,
  X,
  Phone,
  Mail,
  MapPin,
  Truck,
  LogIn,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/lib/stores/useAuth";
import { useCartCount } from "@/hooks/useCartCount";
import { LOGOUT_API } from "@/app/api";
import { defaultNavMenuData } from "../constant";
import Image from "next/image";
import Logo from "./Logo";
import { toast } from "sonner";
import { useRestaurants } from "@/hooks/restaurant.hook";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
// import Logo from './logo/Logo';

// -------------------------
// Top Contact Navbar
// -------------------------
interface ContactNavProps {
  hide?: boolean;
}

const ContactNav: React.FC<ContactNavProps> = ({ hide }) => {
  const { restaurants } = useRestaurants();

  /* 
    phone number, 
    email , 
    address
    */
  return (
    <div
      className={`${
        hide ? "hidden" : "block"
      } bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white`}
    >
      <div className="w-full ah-container text-xs md:text-sm flex justify-between items-center py-2 md:py-3 px-4 sm:px-6 lg:px-8">
        {/* Left Side - Contact Info */}
        <div className="hidden md:flex items-center gap-6">
          {/* Email */}
          <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Mail size={14} className="text-orange-500" />
            <span>order@mamaspizzalondon.com</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <MapPin size={14} className="text-orange-500" />
            <span
              dangerouslySetInnerHTML={{
                __html: restaurants[0]?.shop_address || "",
              }}
            />
          </div>
        </div>

        {/* Center - Delivery Status */}
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <Truck size={14} className="animate-pulse" />
          <span className="hidden sm:inline">Fast Delivery Available</span>
          <span className="sm:hidden">Fast Delivery</span>
        </div>

        {/* Right Side - Phone */}
        <div className="flex items-center gap-4">
          {/* Phone Number */}
          <a
            href="tel:07424295393"
            className="group flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div className="relative">
              <Phone
                size={16}
                className="text-white group-hover:animate-pulse"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex flex-col">07424 295393</div>
          </a>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// Hamburger Menu
// -------------------------
const DefaultHamburgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, clearUser, token } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API if user is authenticated and has a token
      if (isAuthenticated && token) {
        const response = await fetch(LOGOUT_API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          toast.success("Logged out successfully");
        } else {
          console.warn(
            "Logout API call failed, but proceeding with local logout"
          );
        }
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      clearUser();
      router.push("/");
      setOpen(false); // Close the mobile menu
    }
  };

  return (
    <aside>
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger asChild>
          <button className="p-2 sm:p-3 rounded-xl bg-gray-100 border border-gray-300 hover:border-gray-400 transition-colors duration-300 group">
            <MenuIcon
              size={20}
              className="text-gray-800 group-hover:text-black sm:w-6 sm:h-6"
            />
          </button>
        </SheetTrigger>
        <SheetContent className="bg-white border-l border-gray-200 p-0 w-[320px] sm:w-[380px]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="w-[80px] sm:w-[100px]">
                <Logo />
              </div>
              <SheetClose asChild>
                <button className="p-2 rounded-xl bg-gray-100 border border-gray-300 hover:border-gray-400 transition-colors duration-300">
                  <X size={20} className="text-gray-800" />
                </button>
              </SheetClose>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-orange-500 rounded-full"></div>
                  Navigation
                </h3>

                <div className="space-y-1">
                  {defaultNavMenuData.map((item: any, index: number) => (
                    <div key={item.path}>
                      <DefaultNavMenuItem item={item} index={index} />
                    </div>
                  ))}
                </div>

                {/* Area We Serve Mobile Menu */}
                <div className="mt-8 space-y-1">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Delivery Areas
                    </h3>
                    <div className="space-y-1">
                      {areas.map((area) => (
                        <Link
                          key={area.name}
                          href={area.href}
                          className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 border border-transparent hover:border-orange-200 transition-all duration-300"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-300">
                            <MapPin size={14} className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {area.name}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors duration-300">
                              Fast delivery available
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Authentication Section */}
                {isAuthenticated ? (
                  <div className="mt-8 space-y-1">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <div className="space-y-1">
                        {/* User Profile */}
                        <Link
                          href="/profile"
                          className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 border border-transparent hover:border-orange-200 transition-all duration-300"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-300">
                            <UserCircle size={14} className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {user?.name || "Profile"}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors duration-300">
                              Manage your account
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-all duration-300 w-full"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-red-200 group-hover:to-red-200 transition-colors duration-300">
                            <LogOut size={14} className="text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Logout</div>
                            <div className="text-xs text-gray-500 group-hover:text-red-600 transition-colors duration-300">
                              Sign out of your account
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 space-y-1">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <div className="space-y-1">
                        <Link
                          href="/login"
                          className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 border border-transparent hover:border-orange-200 transition-all duration-300"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-300">
                            <LogIn size={14} className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Login</div>
                            <div className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors duration-300">
                              Sign in to your account
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Mobile Menu Items */}
                <div className="mt-8 space-y-1">
                  <Link
                    href="/menu"
                    className="flex items-center justify-between p-4 rounded-2xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all duration-300"
                  >
                    <span className="text-base font-medium">Order Now</span>
                    <ShoppingCart size={16} className="text-gray-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

// -------------------------a
// Nav Item
// -------------------------
const DefaultNavMenuItem: React.FC<{ item: any; index: number }> = ({
  item,
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`block p-4 rounded-2xl transition-all duration-300 group ${
        isActive
          ? "bg-orange-500 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">{item.title}</span>
        <ArrowRight
          size={16}
          className={`transition-transform duration-300 group-hover:translate-x-1 ${
            isActive ? "text-white" : "text-gray-500"
          }`}
        />
      </div>
    </Link>
  );
};

// -------------------------
// Areas Data
// -------------------------
const areas = [
  { name: "Central London", href: "/#" },
  { name: "West London", href: "/#" },
  { name: "East London", href: "/#" },
  { name: "North London", href: "/#" },
  { name: "South London", href: "/#" },
];

// -------------------------
// Area We Serve Menu
// -------------------------
const AreaWeServeMenu: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`group font-semibold uppercase px-4 py-2 rounded-full transition-all duration-300 tracking-widest hover:shadow-lg ${
              isScrolled
                ? "text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border border-transparent hover:border-orange-200"
                : "text-black hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border border-transparent hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={14}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span>Area We Serve</span>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white  shadow-xl rounded-2xl p-0 overflow-hidden w-[380px]">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Delivery Areas
                </h3>
                <p className="text-sm text-gray-500">
                  Choose your location for fast delivery
                </p>
              </div>
              <div className="grid gap-2">
                {areas.map((area) => (
                  <NavigationMenuLink key={area.name} asChild>
                    <Link
                      href={area.href}
                      className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:shadow-md focus:bg-gradient-to-r focus:from-orange-50 focus:to-red-50 focus:shadow-md border border-transparent hover:border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-300">
                            <MapPin size={16} className="text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-none text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                              {area.name}
                            </div>
                            <p className="text-xs leading-snug text-gray-500 group-hover:text-orange-600 transition-colors duration-300 mt-1">
                              We deliver delicious pizza to {area.name}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// -------------------------
// Desktop Menu
// -------------------------
export const DefaultNavMenuList: React.FC<{ isScrolled: boolean }> = ({
  isScrolled,
}) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col pl-7 py-16 lg:gap-6 lg:pl-0 lg:py-0 lg:flex-row lg:items-center whitespace-nowrap">
      {defaultNavMenuData.map((i) => (
        <div key={i.path}>
          <Link
            className={`font-semibold uppercase px-3 tracking-widest py-2 rounded-full transition-all duration-300 ${
              pathname === i.path
                ? isScrolled
                  ? "text-orange-600 bg-orange-100"
                  : "text-orange-600 bg-orange-100"
                : isScrolled
                ? "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                : "text-white hover:text-orange-600 hover:bg-orange-50"
            }`}
            href={i.path}
          >
            {i.title}
          </Link>
        </div>
      ))}
      {/* Area We Serve Menu */}
      <AreaWeServeMenu isScrolled={isScrolled} />
    </div>
  );
};

// -------------------------
// Main Navbar (with scroll hide)
// -------------------------
const Navbar: React.FC = () => {
  const [hideContactNav, setHideContactNav] = useState(false);
  const pathname = usePathname();

  // Check if current page is landing page
  const isLandingPage = pathname === "/";

  // Initialize scroll state based on current page
  const [isScrolled, setIsScrolled] = useState(!isLandingPage);
  const { user, isAuthenticated, clearUser, token } = useAuth();
  const { itemCount, shouldShowCount } = useCartCount();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHideContactNav(scrollY > 50);
      // Only apply scroll effect on landing page
      if (isLandingPage) {
        setIsScrolled(scrollY > 20);
      } else {
        setIsScrolled(true); // Always white on other pages
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const handleLogout = async () => {
    try {
      // Call logout API if user is authenticated and has a token
      if (isAuthenticated && token) {
        const response = await fetch(LOGOUT_API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          toast.success("Logged out successfully");
        } else {
          console.warn(
            "Logout API call failed, but proceeding with local logout"
          );
        }
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      clearUser();
      router.push("/");
    }
  };

  return (
    <div className={`fixed w-full top-0 left-0 z-30`}>
      <ContactNav hide={hideContactNav} />

      {/* Main Nav */}
      <div
        className={`w-full ${
          isScrolled
            ? "bg-white shadow-lg border-b text-gray-800 border-gray-100"
            : "bg-transparent text-white"
        } `}
      >
        <nav className="flex relative justify-between ah-container items-center   md:py-3 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <Logo />
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 xl:gap-6 justify-end">
            {/* Desktop Menu */}
            <div className="hidden lg:flex">
              <DefaultNavMenuList isScrolled={isScrolled} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* User Account - Mobile */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Mobile Profile Icon */}
                  <Link
                    href="/profile"
                    className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                  >
                    <UserCircle
                      size={18}
                      className="text-gray-600 group-hover:text-orange-600"
                    />
                  </Link>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="md:hidden p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
                  >
                    <LogOut
                      size={18}
                      className="text-red-600 group-hover:text-red-700"
                    />
                  </button>

                  {/* Desktop Profile */}
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                    >
                      <UserCircle
                        size={20}
                        className="text-gray-600 group-hover:text-orange-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
                    >
                      <LogOut size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Mobile Login Icon */}
                  <Link
                    href="/login"
                    className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                  >
                    <LogIn
                      size={18}
                      className="text-gray-600 group-hover:text-orange-600"
                    />
                  </Link>

                  {/* Desktop Login */}
                  <Link
                    href="/login"
                    className="hidden md:flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                  >
                    <LogIn
                      size={20}
                      className="text-gray-600 group-hover:text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Login
                    </span>
                  </Link>
                </div>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors group"
              >
                <ShoppingCart size={18} className="text-white sm:w-5 sm:h-5" />
                {shouldShowCount && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* CTA - Hidden on very small screens */}
              <Link
                href="/menu"
                className="hidden sm:block bg-gradient-to-r from-orange-600 to-red-500 text-white px-3 py-2 sm:px-4 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-orange-700 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Order Now
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="block lg:hidden ml-1">
              <DefaultHamburgerMenu />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
