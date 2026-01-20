"use client";

import { useCallback, useRef, useState, useEffect } from 'react';
import { useGuest } from '@/lib/guest/GuestProvider';
import { useDebounce } from './useDebounce';
import { GUESTS_API } from '@/app/api';

interface PageVisitData {
  page_name: string;
  section_name: string;
  in_time: string;
  out_time: string;
}

export function usePageVisitTracker() {
  const { guestId } = useGuest();
  const sectionTimers = useRef<{ [key: string]: { startTime: number; timeoutId: NodeJS.Timeout | null } }>({});
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  
  const debouncedSection = useDebounce(currentSection, 500);

  const trackPageVisit = useCallback(async (pageName: string, sectionName: string) => {
    if (!guestId) return;

    const now = new Date().toISOString();
    const sectionKey = `${pageName}-${sectionName}`;
    
    // If we have a previous section, send it
    if (sectionTimers.current[sectionKey]) {
      const { startTime, timeoutId } = sectionTimers.current[sectionKey];
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      const pageVisitData: PageVisitData = {
        page_name: pageName,
        section_name: sectionName,
        in_time: new Date(startTime).toISOString(),
        out_time: now
      };

      try {
        const response = await fetch(`${GUESTS_API}/${guestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_visits: [pageVisitData]
          })
        });

        if (response.ok) {
          console.log('Page visit tracked:', pageVisitData);
        }
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    } else {
      // This is a new section/page, track it immediately
      // Add 1 second to out_time to ensure it's after in_time
      const outTime = new Date(Date.now() + 1000).toISOString();
      const pageVisitData: PageVisitData = {
        page_name: pageName,
        section_name: sectionName,
        in_time: now,
        out_time: outTime
      };

      try {
        const response = await fetch(`${GUESTS_API}/${guestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_visits: [pageVisitData]
          })
        });

        if (response.ok) {
          console.log('Page visit tracked:', pageVisitData);
        }
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    }

    // Start tracking the new section
    sectionTimers.current[sectionKey] = {
      startTime: Date.now(),
      timeoutId: null
    };
  }, [guestId]);

  const handleSectionEnter = useCallback((pageName: string, sectionName: string) => {
    setCurrentSection(`${pageName}-${sectionName}`);
  }, []);

  // Track when debounced section changes
  useEffect(() => {
    if (debouncedSection) {
      const [pageName, sectionName] = debouncedSection.split('-');
      trackPageVisit(pageName, sectionName);
    }
  }, [debouncedSection, trackPageVisit]);

  return { handleSectionEnter };
}
