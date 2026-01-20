'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { useSidebar } from '@/app/(admin)/template';
import { useAuth } from '@/lib/stores/useAuth';
import NotificationDropdown from './NotificationDropdown';

const AdminNavbar: React.FC = () => {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const { user, clearUser } = useAuth();
    const router = useRouter();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleLogout = () => {
        clearUser();
        router.push('/login');
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left side - Search */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                    <p>Admin Dashboard</p>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'admin@foodapp.com'}</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowProfileDropdown(false)}
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
