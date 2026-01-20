"use client";
import ProfilePageComponent from "@/components/pages/profile-page/ProfilePage"
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";
import { useEffect, useRef } from "react";

const ProfilePage = () => {
  const { handleSectionEnter } = usePageVisitTracker();
  const hasTrackedExtended = useRef(false);
    
  // Track page visit on load
  useEffect(() => {
    handleSectionEnter("Profile Page", "Profile");
    
    // Track extended visit after 5 seconds
    const extendedTimer = setTimeout(() => {
      if (!hasTrackedExtended.current) {
        handleSectionEnter("Profile Page", "Profile");
        hasTrackedExtended.current = true;
      }
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(extendedTimer);
    };
  }, [handleSectionEnter]);

  return (
    <div>
      <ProfilePageComponent />
    </div>
  )
}

export default ProfilePage