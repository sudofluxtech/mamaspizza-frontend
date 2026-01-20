'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Upload, Edit3, Save, X } from 'lucide-react'
import { useAuth } from '@/lib/stores/useAuth'
import { authAPI } from '@/lib/api/auth.api'
import { useNotification } from '@/components/ui/NotificationProvider'
import AdminProfileCard from './AdminProfileCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const AdminProfileInfoTab: React.FC = () => {
  const { user, token, updateUser, setLoading, loading } = useAuth()
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Initialize form data when user data is available
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    try {
      setLoading(true)

      const response = await authAPI.updateProfile(token, {
        name: formData.name,
        email: formData.email,
        user_image: selectedImage || undefined,
      })

      // Check for success with user data
      if (response.success && response.data?.user) {
        const userData = response.data.user
        updateUser(userData)

        showNotification({
          type: 'success',
          title: 'Success',
          message: response.message || 'Profile updated successfully',
        })

        setIsEditing(false)
        setSelectedImage(null)
        setImagePreview(null)
      } else {
        console.error('Profile update failed:', response)
        showNotification({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to update profile',
        })
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Something went wrong while updating profile',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setSelectedImage(null)
    setImagePreview(null)
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <AdminProfileCard
              profile={user}
              isEditing={isEditing}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border pl-10 pr-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      isEditing
                        ? 'border-gray-300 bg-white'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border pl-10 pr-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      isEditing
                        ? 'border-gray-300 bg-white'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Image Upload (only when editing) */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageChange(file)
                      }}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer text-sm"
                    >
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-gray-600">Choose Image</span>
                    </label>
                    {selectedImage && (
                      <span className="text-sm text-green-600">
                        {selectedImage.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Square image, max 2MB
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfileInfoTab
