'use client'

import React from 'react'
import { User, Mail, Upload } from 'lucide-react'

interface ProfileFormProps {
  formData: {
    name: string
    email: string
  }
  isEditing: boolean
  loading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onImageChange: (file: File) => void
  selectedImage: File | null
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onSubmit,
  onImageChange,
  selectedImage
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={20} className="text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onInputChange}
              disabled={!isEditing}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              disabled={!isEditing}
              className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                isEditing 
                  ? 'border-gray-200 bg-white' 
                  : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {/* Image Upload (only when editing) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-600">Choose Image</span>
              </button>
              {selectedImage && (
                <span className="text-sm text-green-600">
                  {selectedImage.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, max 2MB
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default ProfileForm
