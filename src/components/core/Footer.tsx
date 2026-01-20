'use client';
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";
import { useRestaurants } from "@/hooks/restaurant.hook";

export default function Footer() {
  // const year = new Date().getFullYear();
  const { restaurants } = useRestaurants();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Track Order", href: "/track" },
    { name: "My Account", href: "/profile" }
  ];

  const policies = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-condition" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Payment Policy", href: "/payment-policy" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-br sticky top-[100%] from-gray-900 via-gray-800 to-gray-900 text-white  overflow-hidden">

      {/* Background Pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full -translate-x-48 -translate-y-48">
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full translate-x-48 translate-y-48"></div>
      </div> */}

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="relative ah-container px-4 md:px-6 lg:px-8 py-16">
          {/* <FoodIcon size={'200'} className="text-gray-600  rotate-45 absolute -bottom-20 left-0" /> */}

          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Logo />
              </div>
              <p className="text-gray-300 leading-relaxed text-sm max-w-sm mx-auto md:mx-0">
                Delivering delicious meals with love and care. Fresh ingredients, local favorites,
                and weekly specials that will make your taste buds dance.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 justify-center md:justify-start">
                  <Phone size={16} className="text-orange-500" />
                  <span className="text-sm">07424 295393</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 justify-center md:justify-start">
                  <Mail size={16} className="text-orange-500" />
                  <span className="text-sm">order@mamaspizzalondon.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 justify-center md:justify-start">
                  <MapPin size={16} className="text-orange-500" />
                  <span
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: restaurants[0]?.shop_address || ""
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-orange-500 transition-colors duration-300 group"
                  >
                    <span className="text-sm">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Policies */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-white">Policies</h3>
              <nav className="space-y-3">
                {policies.map((policy) => (
                  <Link
                    key={policy.name}
                    href={policy.href}
                    className="block text-gray-300 hover:text-orange-500 transition-colors duration-300 group"
                  >
                    <span className="text-sm">{policy.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
                <p className="text-gray-300 text-sm mb-6 max-w-sm mx-auto md:mx-0">
                  Stay connected with us on social media for the latest updates and special offers.
                </p>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}