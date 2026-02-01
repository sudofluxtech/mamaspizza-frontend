"use client";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  PhoneCall,
} from "lucide-react";
import Logo from "./Logo";
import { useRestaurants } from "@/hooks/restaurant.hook";

export default function Footer() {
  const year = new Date().getFullYear();
  const { restaurants } = useRestaurants();

  const mainLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Track Order", href: "/track" },
    { name: "My Account", href: "/profile" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const hours = [
    { day: "Monday", time: "11:00 AM - 11:00 PM" },
    { day: "Tuesday", time: "11:00 AM - 11:00 PM" },
    { day: "Wednesday", time: "11:00 AM - 11:00 PM" },
    { day: "Thursday", time: "11:00 AM - 11:00 PM" },
    { day: "Friday", time: "11:00 AM - 12:00 AM" },
    { day: "Saturday", time: "11:00 AM - 12:00 AM" },
    { day: "Sunday", time: "12:00 PM - 11:00 PM" },
  ];

  return (
    <footer className="bg-gradient-to-br sticky top-[100%] from-gray-900 via-gray-800 to-gray-900 text-orange-50 overflow-hidden">
      <div className="ah-container mx-auto">
        {/* Top Section - Four Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 py-8 sm:py-12 md:py-16">
          {/* Column 1 - Brand & Social */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            {/* Logo */}
            <div>
              <div className="w-fit mx-auto md:-mx-5">
                <Logo />
              </div>
              <p className="mt-4 text-sm md:text-base">
                <strong>Mama&apos;s Pizza</strong> is your go-to destination for
                authentic Italian pizza in London. We specialize in{" "}
                <strong>fresh, hand-tossed pizzas</strong> made with premium
                ingredients and traditional recipes, delivering across{" "}
                <strong>London with love and care</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <Link
                  target="_blank"
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 md:w-10 md:h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
                  aria-label={social.label}
                >
                  <social.icon size={16} className="md:w-[18px] md:h-[18px]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 - Main Navigation */}
          <div className="text-center md:text-left w-max mx-auto">
            <p className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-orange-50">
              Quick Links
            </p>
            <nav className="space-y-2 md:space-y-3">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-orange-50 hover:opacity-80 transition-opacity duration-300"
                >
                  <span className="text-xs sm:text-sm">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 - Opening Hours */}
          <div className="text-center md:text-left ">
            <p className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-orange-50">
              Opening Hours
            </p>

            <div className="text-sm">
              {hours.map(({ day, time }) => (
                <div
                  className="flex items-center justify-between mb-2"
                  key={day}
                >
                  <p>{day}:</p>
                  <p className="text-right">{time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Contact & Map */}
          <div className="text-center md:text-left">
            <p className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-orange-50">
              Contact Us
            </p>
            <div>
              <div className="flex flex-row gap-x-2 items-start">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <p
                  className="text-sm text-left"
                  dangerouslySetInnerHTML={{
                    __html: restaurants[0]?.shop_address || "London, UK",
                  }}
                />
              </div>
              <div className="flex flex-row gap-x-2 items-start mt-4">
                <PhoneCall className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-sm">07424 295393</p>
              </div>
              <div className="flex flex-row gap-x-2 items-start mt-4">
                <Mail className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-sm">order@mamaspizzalondon.com</p>
              </div>
            </div>
            {/* Google Maps iframe */}
            <div className="mt-6 rounded-[28px] border border-orange-300 bg-white shadow-[0_20px_35px_rgba(37,51,29,0.08)] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2476.5124598!2d0.0110811!3d51.5124598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a7a0f77c5c5d%3A0x5e1c3b0a0a0a0a0a!2sSt.%20Lukes%20Social%20Enterprise%20Centre%2C%2085%20Tarling%20Road%2C%20London%20E16%201HN!5e0!3m2!1sen!2suk!4v1234567890123!5m2!1sen!2suk"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Middle Section - Large Brand Text */}
        <div className="py-6 md:py-8 lg:py-12 text-center overflow-hidden">
          <p
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] xl:text-[100px] 2xl:text-[140px] font-bold text-orange-50 tracking-tight break-words px-2"
            style={{ fontFamily: "serif" }}
          >
            MAMA&apos;S PIZZA
          </p>
        </div>

        {/* Bottom Section - Copyright & Developer Credit */}
        <div className="border-t border-orange-500/30 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs sm:text-sm text-orange-50 text-center md:text-left">
            <div className="wrap-break-word">
              {year} © MAMA&apos;S PIZZA LONDON
            </div>
            <Link
              target="_blank"
              href="https://sudoflux.com/"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              Developed by Sudo Flux
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
