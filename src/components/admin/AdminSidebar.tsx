'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Utensils,
    FolderOpen,
    User,
    ChevronDown,
    Settings,
    Percent,
    // Menu,
    LogOut,
    Mail,
    Eye,
} from 'lucide-react';
// import Logo from '../core/Logo';
import { useSidebar } from '@/app/(admin)/template';
import { LOGOUT_API } from '@/app/api';
import { useAuth } from '@/lib/stores/useAuth';
import { toast } from 'sonner';

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Offers',
        href: '/admin/offers',
        icon: Percent,
    },
    {
        title: 'Foods',
        href: '/admin/foods',
        icon: Utensils,
        children: [
            {
                title: 'Category',
                href: '/admin/foods/category',
                icon: FolderOpen,
            },
            {
                title: 'Food Items',
                href: '/admin/foods/items',
                icon: Utensils,
            },
            {
                title: 'Sizes',
                href: '/admin/foods/sizes',
                icon: FolderOpen,
            },
        ],
    },
    {
        title: 'Post Codes',
        href: '/admin/post-codes',
        icon: FolderOpen,
        children: [
            {
                title: 'Codes',
                href: '/admin/post-codes',
                icon: FolderOpen,
            },
            {
                title: 'Guest Codes',
                href: '/admin/guest-post-codes',
                icon: FolderOpen,
            },
        ],
    },
    {
        title: 'Profile',
        href: '/admin/profile',
        icon: User,
    },
    {
        title: 'Contact',
        href: '/admin/contact-management',
        icon: Mail,
    },
    {
        title: 'Visitors',
        href: '/admin/visitors',
        icon: Eye,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
    // {
    //     title: 'Notifications',
    //     href: '/admin/notifications',
    //     icon: Bell,
    // },
];

const AdminSidebar: React.FC = () => {
    const router = useRouter();

    const { isCollapsed } = useSidebar();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    // Ensure client-side rendering to prevent hydration mismatch
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleExpanded = (href: string) => {
        if (isCollapsed) return;
        setExpandedItems(prev => 
            prev.includes(href) 
                ? prev.filter(item => item !== href)
                : [...prev, href]
        );
    };

    React.useEffect(() => {
        if (isCollapsed) {
            setExpandedItems([]);
        }
    }, [isCollapsed]);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };
    const {  isAuthenticated, clearUser, token } = useAuth();

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
    

    const renderSidebarItem = (item: SidebarItem, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = isClient && expandedItems.includes(item.href);
        const active = isActive(item.href);

        return (
            <div key={item.href}>
                <div
                    className={`group relative flex items-center justify-between px-3 py-2.5 mx-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        active
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${level > 0 ? 'ml-6' : ''}`}
                    onClick={() => hasChildren ? toggleExpanded(item.href) : undefined}
                >
                    <Link 
                        href={item.href} 
                        className="flex items-center gap-3 flex-1 min-w-0"
                        onClick={(e) => hasChildren ? e.preventDefault() : undefined}
                    >
                        <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
                            active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                        }`}>
                            <item.icon size={18} />
                        </div>
                        {!isCollapsed && (
                            <span className="font-medium text-sm truncate">{item.title}</span>
                        )}
                    </Link>
                    
                    {hasChildren && !isCollapsed && (
                        <div className={`flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Children items */}
                {hasChildren && isExpanded && !isCollapsed && isClient && (
                    <div className="mt-1 ml-4 space-y-1">
                        {item.children!.map(child => renderSidebarItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`bg-white border-r border-gray-100 h-full transition-all duration-300 flex flex-col ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
                                <p className="text-xs text-gray-500">Dashboard</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map(item => renderSidebarItem(item))}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100">
                <button onClick={handleLogout} className="group flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 group-hover:text-gray-700">
                        <LogOut size={18} />
                    </div>
                    {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
