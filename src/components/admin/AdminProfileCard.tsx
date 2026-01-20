'use client'

import React from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'

interface AdminProfileCardProps {
  profile: {
    name?: string
    email?: string
    user_image?: string | null
    role?: string
  }
  isEditing: boolean
  imagePreview?: string | null
  onImageChange: (file: File) => void
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({
  profile,
  isEditing,
  imagePreview,
  onImageChange,
}) => {
  const displayImage = imagePreview || (profile.user_image ? `${process.env.NEXT_PUBLIC_API_URL}/public/${profile.user_image}` : null)

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={profile.name || 'Profile'}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User size={32} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {isEditing && (
          <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors shadow-lg">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onImageChange(file)
              }}
              className="hidden"
            />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </label>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'No Name'}</h3>
        <p className="text-sm text-gray-600">{profile.email || 'No Email'}</p>
        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
          {profile.role || 'Admin'}
        </span>
      </div>
    </div>
  )
}

export default AdminProfileCard
