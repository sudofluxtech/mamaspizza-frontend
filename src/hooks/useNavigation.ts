'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/stores/useAuth';
// import { useAuth } from '@/lib/auth/AuthContext';

interface UseNavigationOptions {
  redirectTo?: string;
  allowedRoles?: ('admin' | 'staff' | 'user')[];
  requireAuth?: boolean;
}

export const useNavigation = (options: UseNavigationOptions = {}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { redirectTo, allowedRoles, requireAuth = true } = options;

  useEffect(() => {
    if (loading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // If user is authenticated but role is not allowed
    if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      if (user.role === 'admin' || user.role === 'staff') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
      return;
    }

    // If user is authenticated and has the right role, redirect to specified path
    if (isAuthenticated && user && redirectTo) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, user, allowedRoles, requireAuth, redirectTo, router]);

  return {
    user,
    isAuthenticated,
    loading,
    canAccess: isAuthenticated && user && (!allowedRoles || allowedRoles.includes(user.role)),
  };
};
