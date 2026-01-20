"use client";

import React from "react";
import { NotificationProvider } from "@/components/ui/NotificationProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <NotificationProvider>{children}</NotificationProvider>
    </ErrorBoundary>
  );
}
