'use client';
import React, { useState, createContext, useContext } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RoleProtected from '@/lib/auth/RoleProtected';

// Create context for sidebar state
const SidebarContext = createContext<{
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}>({
    isCollapsed: false,
    setIsCollapsed: () => {},
});

// Custom hook to use sidebar context
export const useSidebar = () => useContext(SidebarContext);

const Template = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering to prevent hydration mismatch
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    // During hydration, render minimal loader without revealing admin UI or children
    if (!isClient) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <RoleProtected allowedRoles={['admin', 'staff']}>
            <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
                <div className="min-h-screen bg-gray-50/50">
                    {/* Sidebar */}
                    <div className="fixed left-0 top-0 h-full z-40 shadow-lg">
                        <AdminSidebar />
                    </div>
                    
                    {/* Main Content Area */}
                    <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                        {/* Top Navbar */}
                        <AdminNavbar />
                        
                        {/* Page Content */}
                        <main className="p-6 min-h-screen">
                            <div className="">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarContext.Provider>
        </RoleProtected>
    );
};

export default Template;