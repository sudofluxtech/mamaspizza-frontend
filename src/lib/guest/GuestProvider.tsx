"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useGuestId } from "./useGuestId";
import { getBrowserType, getDeviceType } from "../getDeviceType";
import { useCreateGuestSession } from "@/hooks/guest-session.hook";

interface GuestContextType {
  guestId: string | null;
  isLoading: boolean;
  refreshGuestId: () => string;
  canOrder: boolean;
  setCanOrder: (value: boolean) => void;
  device: "mobile" | "tablet" | "desktop" | "unknown";
  browserType: string | null;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

interface GuestProviderProps {
  children: ReactNode;
}

export const GuestProvider: React.FC<GuestProviderProps> = ({ children }) => {
  const guestData = useGuestId();
  const { createGuestSession } = useCreateGuestSession();
  const hasTrackedVisitor = useRef(false);
  const isTrackingInProgress = useRef(false);

  const [device, setDevice] = useState<
    "mobile" | "tablet" | "desktop" | "unknown"
  >("unknown");

  useEffect(() => {
    setDevice(getDeviceType());
  }, []);

  const [browserType, setBrowserType] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ua = navigator.userAgent;
      if (ua) {
        setBrowserType(getBrowserType(ua));
      }
    } catch (err: any) {
      console.error('Error getting browser type:', err);
    }
  }, []);

  // Extract ref parameter from URL
  const getRefFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
  }, []);

  // Check if visitor has already been tracked for this guest ID
  const hasVisitorBeenTracked = useCallback((guestId: string) => {
    if (typeof window === 'undefined') return false;
    const trackedKey = `visitor_tracked_${guestId}`;
    return localStorage.getItem(trackedKey) === 'true';
  }, []);

  // Mark visitor as tracked for this guest ID
  const markVisitorAsTracked = useCallback((guestId: string) => {
    if (typeof window === 'undefined') return;
    const trackedKey = `visitor_tracked_${guestId}`;
    localStorage.setItem(trackedKey, 'true');
  }, []);

  // Track visitor session using useCallback
  const trackVisitor = useCallback(async () => {
    // Early return if already tracked in this session
    if (hasTrackedVisitor.current || isTrackingInProgress.current) return;

    // Early return if we don't have all required data
    if (!guestData.guestId || !device || !browserType) {
      return;
    }

    // Skip if device type is unknown
    if (device === "unknown") {
      return;
    }

    // Check if this guest has already been tracked
    if (hasVisitorBeenTracked(guestData.guestId)) {
      console.log("Visitor already tracked for this guest ID:", guestData.guestId);
      hasTrackedVisitor.current = true;
      return;
    }

    // Mark as tracking to prevent concurrent calls
    isTrackingInProgress.current = true;

    try {
      const ref = getRefFromUrl();
      
      // Type guards to ensure non-null values
      if (!guestData.guestId || !browserType) {
        console.error("Missing required data for tracking");
        isTrackingInProgress.current = false;
        return;
      }
      
      const sessionData = {
        guest_id: guestData.guestId,
        ref: ref || "direct", // Default to "direct" if no ref parameter
        device_type: device,
        browser: browserType
      };

      console.log("Creating guest session:", sessionData);
      
      await createGuestSession(sessionData);
      
      // Mark as tracked in localStorage and session
      markVisitorAsTracked(guestData.guestId);
      hasTrackedVisitor.current = true;
      
      console.log("Guest session created successfully");
    } catch (error) {
      console.error("Failed to create guest session:", error);
    } finally {
      isTrackingInProgress.current = false;
    }
  }, [guestData.guestId, device, browserType, createGuestSession, getRefFromUrl, hasVisitorBeenTracked, markVisitorAsTracked]);

  // Track visitor when all data is available
  useEffect(() => {
    if (guestData.guestId && device && browserType) {
      trackVisitor();
    }
  }, [trackVisitor, guestData.guestId, device, browserType]);

  const value: GuestContextType = {
    ...guestData,
    device,
    browserType,
  };

  return (
    <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
  );
};

// Custom hook to use guest context
export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);

  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }

  return context;
};
