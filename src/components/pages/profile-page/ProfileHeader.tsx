'use client'

import React from 'react'
import Image from 'next/image'

interface ProfileHeaderProps {
  title: string
  subtitle: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="relative h-[400px] flex items-center justify-center overflow-hidden mb-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Orange gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-orange-500/70 to-orange-400/80"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
          {title}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-white to-orange-100 mx-auto rounded-full mb-6"></div>
        <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default ProfileHeader
