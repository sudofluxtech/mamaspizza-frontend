"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../stores/useAuth";
// import { useAuth } from "./AuthContext";

// Client-only protective wrapper for admin routes
export default function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Ensure hooks are called unconditionally; gate logic by loading state
  useEffect(() => {
    if (loading) return; // wait until auth state is resolved
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // While loading auth state, do not render children to avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // avoid revealing content

  return <>{children}</>;
}