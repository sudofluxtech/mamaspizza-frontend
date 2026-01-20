'use client'

import React from 'react'
import { Shield, Calendar } from 'lucide-react';
import ImageUpload from './ImageUpload'
import { User as UserType } from '@/lib/stores/useAuth'

interface ProfileCardProps {
  profile: UserType
  isEditing: boolean
  imagePreview?: string | null
  onImageChange: (file: File) => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isEditing,
  imagePreview,
  onImageChange
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'staff':
        return 'bg-blue-100 text-blue-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center">
        {/* Profile Image */}
        <div className="mb-4">
          <ImageUpload
              currentImage={profile.user_image ? `${profile.user_image}` : null}
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            isEditing={isEditing}
            size="lg"
          />
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {profile.name || 'Unknown User'}
        </h2>
        <p className="text-gray-600 mb-4">{profile.email || 'No email provided'}</p>
        
        {/* Role Badge */}
        <div className="inline-flex items-center gap-2">
          <Shield size={16} className="text-gray-500" />
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role || 'user')}`}>
            {(profile.role || 'user').toUpperCase()}
          </span>
        </div>

        {/* Member Since */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
