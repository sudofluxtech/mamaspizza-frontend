'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../stores/useAuth';

interface RoleProtectedProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'staff' | 'user')[];
  fallbackPath?: string;
}

export default function RoleProtected({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}: RoleProtectedProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.replace(fallbackPath);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
      return;
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, fallbackPath]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
