"use client"
import { useRef, useEffect } from "react"
import HeroSection from "./HeroSection"
import MenuSection from "./MenuSection"
import ProcessSection from "./ProcessSection"
import WhyChooseUsSection from "./WhyChooseUsSection"
import MapSection from "./MapSection"
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker"
// import ReviewSection from "./ReviewSection"

const HomeContainer = () => {
    const { handleSectionEnter } = usePageVisitTracker();
    
    // Create refs for each section
    const heroRef = useRef<HTMLDivElement>(null);
    const processRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const whyChooseUsRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for scroll-based tracking
    useEffect(() => {
        const sections = [
            { ref: heroRef, name: "Hero" },
            { ref: processRef, name: "Process" },
            { ref: menuRef, name: "Menu" },
            { ref: mapRef, name: "Map" },
            { ref: whyChooseUsRef, name: "WhyChooseUs" }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionName = sections.find(s => s.ref.current === entry.target)?.name;
                        if (sectionName) {
                            handleSectionEnter("Home", sectionName);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of section is visible
                rootMargin: '0px 0px -10% 0px' // Add some margin for better UX
            }
        );

        sections.forEach(section => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });

        // Check if Hero section is visible on page load and trigger it
        const checkInitialSection = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.top < window.innerHeight * 0.5;
                if (isVisible) {
                    handleSectionEnter("Home", "Hero");
                }
            }
        };

        // Check immediately and after a short delay
        checkInitialSection();
        const timer = setTimeout(checkInitialSection, 200);

        return () => {
            clearTimeout(timer);
            sections.forEach(section => {
                if (section.ref.current) {
                    observer.unobserve(section.ref.current);
                }
            });
        };
    }, [handleSectionEnter]);

    return (
        <div>
            <div ref={heroRef}>
                <HeroSection />
            </div>
            
            <div ref={processRef}>
                <ProcessSection />
            </div>
            
            <div ref={menuRef}>
                <MenuSection />
            </div>
            
            <div ref={mapRef}>
                <MapSection />
            </div>
            
            <div ref={whyChooseUsRef}>
                <WhyChooseUsSection />
            </div>
        </div>
    )
}
export default HomeContainer