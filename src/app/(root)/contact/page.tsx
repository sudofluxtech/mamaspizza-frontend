"use client";
import ContactPageComponent from "@/components/pages/contact-page/ContactPage"
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";
import { useEffect, useRef } from "react";

const ContactPage = () => {
  const { handleSectionEnter } = usePageVisitTracker();
  const hasTrackedExtended = useRef(false);
    
  // Track page visit on load
  useEffect(() => {
    handleSectionEnter("Contact Page", "Contact");
    
    // Track extended visit after 5 seconds
    const extendedTimer = setTimeout(() => {
      if (!hasTrackedExtended.current) {
        handleSectionEnter("Contact Page", "Contact");
        hasTrackedExtended.current = true;
      }
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(extendedTimer);
    };
  }, [handleSectionEnter]);

  return (
    <div className="mt-[150px]">
      <ContactPageComponent />
    </div>
  )
}

export default ContactPage