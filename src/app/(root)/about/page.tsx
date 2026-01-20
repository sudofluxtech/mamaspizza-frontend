"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, Users, Award,  ChefHat, Leaf, Shield, Smile } from 'lucide-react';
import { usePageVisitTracker } from '@/hooks/usePageVisitTracker';

export default function AboutPage() {
  const { handleSectionEnter } = usePageVisitTracker();
  const hasTrackedExtended = useRef(false);
    
  // Track page visit on load
  useEffect(() => {
    handleSectionEnter("About", "Hero");
    
    // Track extended visit after 5 seconds
    const extendedTimer = setTimeout(() => {
      if (!hasTrackedExtended.current) {
        handleSectionEnter("About", "Hero");
        hasTrackedExtended.current = true;
      }
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(extendedTimer);
    };
  }, [handleSectionEnter]);

  return (
    <main className="min-h-screen mt-[200px]">
      {/* Our Story */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="w-20 h-1 bg-orange-500 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  What started as a small family kitchen has grown into a beloved neighborhood institution. 
                  Our founder, Maria, brought her grandmother&apos;s secret recipes from Italy, combining them 
                  with local ingredients and modern techniques.
                </p>
                <p>
                  Today, we continue that tradition of love, quality, and community. Every pizza is 
                  hand-tossed, every sauce is made fresh daily, and every customer is treated like family.
                </p>
                <p>
                  We believe great food brings people together, and that&apos;s exactly what we&apos;ve been doing 
                  for over 10 years in this community.
                </p>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">10+</div>
                  <div className="text-sm text-gray-500">Years Serving</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">50K+</div>
                  <div className="text-sm text-gray-500">Happy Families</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">4.9★</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero.jpg"
                  alt="Our kitchen and team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Chef Maria</div>
                    <div className="text-sm text-gray-500">Head Chef & Founder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values guide everything we do, from sourcing ingredients to serving our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon={<Leaf className="w-8 h-8" />}
              title="Fresh & Natural"
              description="We source the finest ingredients locally and prepare everything fresh daily. No preservatives, no shortcuts."
            />
            <ValueCard
              icon={<Heart className="w-8 h-8" />}
              title="Made with Love"
              description="Every dish is crafted with the same care and attention we'd give to our own family meals."
            />
            <ValueCard
              icon={<Users className="w-8 h-8" />}
              title="Community First"
              description="We're more than a restaurant – we're a gathering place where neighbors become friends."
            />
            <ValueCard
              icon={<Shield className="w-8 h-8" />}
              title="Quality Promise"
              description="Consistent excellence in every bite. We never compromise on taste, freshness, or service."
            />
            <ValueCard
              icon={<Award className="w-8 h-8" />}
              title="Award Winning"
              description="Recognized by local food critics and loved by our community for authentic flavors and exceptional service."
            />
            <ValueCard
              icon={<Smile className="w-8 h-8" />}
              title="Happy Customers"
              description="Your satisfaction is our greatest reward. We measure success by the smiles on our customers' faces."
            />
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Family
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind every delicious meal and memorable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMember
              name="Maria Rodriguez"
              role="Founder & Head Chef"
              description="Bringing authentic Italian recipes passed down through generations."
              image="/hero.jpg"
            />
            <TeamMember
              name="Antonio Silva"
              role="Pizza Master"
              description="Perfecting the art of hand-tossed dough for over 8 years."
              image="/hero.jpg"
            />
            <TeamMember
              name="Sofia Chen"
              role="Operations Manager"
              description="Ensuring every customer leaves with a smile and a full heart."
              image="/hero.jpg"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Us Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Come experience the warmth of our kitchen and the taste of authentic Italian cuisine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard
              icon={<MapPin className="w-6 h-6" />}
              title="Location"
              content="123 Pizza Street<br />Downtown District<br />New York, NY 10001"
            />
            <ContactCard
              icon={<Phone className="w-6 h-6" />}
              title="Phone"
              content="(555) 123-PIZZA<br />Call for orders & reservations"
            />
            <ContactCard
              icon={<Clock className="w-6 h-6" />}
              title="Hours"
              content="Mon-Sun: 11AM - 10PM<br />Kitchen closes at 9:30PM"
            />
          </div>
        </div>
      </section> */}
    </main>
  );
}

// Value Card Component
function ValueCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-200 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Team Member Component - Currently unused
// function TeamMember({ name, role, description, image }: {
//   name: string;
//   role: string;
//   description: string;
//   image: string;
// }) {
//   return (
//     <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
//       <div className="relative h-64">
//         <Image
//           src={image}
//           alt={name}
//           fill
//           className="object-cover"
//         />
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
//         <p className="text-orange-600 font-medium mb-3">{role}</p>
//         <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
//       </div>
//     </div>
//   );
// }

// Contact Card Component - Currently unused
// function ContactCard({ icon, title, content }: {
//   icon: React.ReactNode;
//   title: string;
//   content: string;
// }) {
//   return (
//     <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
//       <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6">
//         {icon}
//       </div>
//       <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
//       <div 
//         className="text-gray-600 leading-relaxed"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     </div>
//   );
// }